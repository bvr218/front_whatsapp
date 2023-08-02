<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Auth; 
use DB; 

class CRMController extends Controller
{
    public function closeSesion(){
        Auth::logout();
        return redirect()->route("login");
    }
    private function getInfo(){
        $usuarios =  DB::table("users")
                        ->get();   
        
        $users = [];
        $users[] = [
            "id"=>0,
            "username"=>"Sin Asignar",
            "nombres"=>"Sin Asignar"
        ];
        foreach($usuarios as $usuario){
            $users[] = [
                "id"=>$usuario->id,
                "username"=>$usuario->email,
                "nombres"=>$usuario->name
            ];
        }
        
        $chats = DB::table('chats_whatsapp')
                        ->orderBy("last_update","desc")
                        ->get();
        
        return [$chats,$users];
    }
    public function whatsapp(Request $request){
        $instancia = DB::table("instancia")
                            ->first();
        $title = "Whatsapp";
        if(is_null($instancia) || empty($instancia)){
            return view("whatsapp")->with(compact("instancia","title"));
        }
        if($instancia->status!=0){
            $info = $this->getInfo();
            return view("whatsapp")->with(compact("instancia","info","title"));
        }
        return view("whatsapp")->with(compact("instancia"));
        
    }
    public function whatsappActions(Request $request){
        $unique = uniqid();
        file_put_contents("uniqueid",$unique);

        switch ($request->input("action")) {
            case 'getChat':
                $instancia = DB::table("instancia")
                                        ->first();
                $secret = "sk_wh47s1v3"; //no borrar, id para seguridad
                $url = 'https://api.whatsive.com/aliance/';
                $data = array(
                    'secret' => $secret,
                    'action' => 'getChat',
                    'id' => $request->input("id"),
                    'limit' => $request->input("limit"),
                    'idVerification'=>$unique,
                    'addr'=>$instancia->addr,
                    'port'=>$instancia->port
                );

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                
                $response = curl_exec($ch);
                $response = json_decode($response);
                if($response->salida != "success"){
                    return json_encode(["salida"=>"error","message"=>$response->message]);
                }
                if (curl_errno($ch)) {
                    return json_encode(["salida"=>"error","message"=>"No se pudo recuperar el archivo"]);
                }
                curl_close($ch);
                return json_encode(["salida"=>"success","messages"=>$response->chats]);
                break;
            case 'closeChat':
                DB::statement("UPDATE `chats_whatsapp` set `estado`= 'cerrado' where number='".explode("@",$request->input("id"))[0]."'");
                return "true";
                break;
            case 'changeTecnico':
                DB::statement("UPDATE `chats_whatsapp` set `asigned_to`= '".$request->input("tecnico")."' where number='".explode("@",$request->input("id"))[0]."'");
                return "true";
                break;
            case 'changeName':
                DB::statement("UPDATE `chats_whatsapp` set `name`= '".$request->input("nombre")."' where number='".explode("@",$request->input("id"))[0]."'");
                return "true";
                break;
            case 'getMedia':
                $instancia = DB::table("instancia")
                                        ->first();
                $secret = "sk_wh47s1v3"; //no borrar, id para seguridad
                $url = 'https://api.whatsive.com/aliance/';
                $data = array(
                    'secret' => $secret,
                    'action' => 'getMedia',
                    'id' => $request->input("id"),
                    'idVerification'=>$unique,
                    'addr'=>$instancia->addr,
                    'port'=>$instancia->port
                );

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                
                $response = curl_exec($ch);
                $response = json_decode($response);
                if($response->salida != "success"){
                    return json_encode(["salida"=>"error","message"=>$response->message]);
                }
                if (curl_errno($ch)) {
                    return json_encode(["salida"=>"error","message"=>"No se pudo recuperar el archivo"]);
                }
                curl_close($ch);
                return json_encode(["salida"=>"success","src"=>"data:".$request->input("mimetype").";base64,".$response->src]);
                break;
            case 'sendMessage':
                $instancia = DB::table("instancia")
                                        ->first();
                if($request->input("cron") == "true"){ 
                    $usuario = DB::table("users")
                                        ->where("id","=","1")
                                        ->first();
                }else{
                    $usuario = DB::table("users")
                                        ->where("id","=",Auth::user()->id)
                                        ->first();
                }
                $secret = "sk_wh47s1v3"; //no borrar, id para seguridad
                $message;
                if($request->input("cron") == "true"){ 
                    $message = $request->input("message");
                }else{
                    $message = "*".trim($usuario->name)."*\n".$request->input("message");
                }
                $url = 'https://api.whatsive.com/aliance/';
                $data = array(
                    'secret' => $secret,
                    'action' => 'sendMessage',
                    'isFile' => 'false',
                    'message' => $message,
                    'recipient' => $request->input("id"),
                    'idVerification'=>$unique,
                    'addr'=>$instancia->addr,
                    'port'=>$instancia->port
                );

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                
                $response = curl_exec($ch);
                $response = json_decode($response);
                if($response->salida != "success"){
                    return json_encode(["salida"=>"error","message"=>$response->message]);
                }
                if (curl_errno($ch)) {
                    return json_encode(["salida"=>"error","message"=>"No se pudo enviar el mensaje"]);
                }
                curl_close($ch);
                DB::statement("UPDATE `chats_whatsapp` SET `last_message`= '".$request->input("message")."', `last_update`='".date("Y-m-d H:i:s")."', `notRead`='0', `fromMe`='1' WHERE `number`= '".explode("@",$request->input("id"))[0]."' ");
                return json_encode(["salida"=>"success","message"=>"mensaje enviado correctamente","from"=>$request->input("id"),"body"=>$request->input("message"),"timestamp"=>strtotime(date("Y-m-d H:i:s"))]);
                break;
            case 'sendFile':
                $instancia = DB::table("instancia")
                                        ->first();
                $usuario;
                if($request->input("cron") == "true"){ 
                    $usuario = DB::table("users")
                                        ->where("id","=","1")
                                        ->first();
                }else{
                    $usuario = DB::table("users")
                                        ->where("id","=",Auth::user()->id)
                                        ->first();
                }
                
                $secret = "sk_wh47s1v3"; //no borrar, id para seguridad
                $message;
                if($request->input("cron") == "true"){ 
                    $message = $request->input("mensaje");
                }else{
                    $message = "*".trim($usuario->name)."*\n".$request->input("mensaje");
                }
                if($request->input("cron") == "true"){ 
                    $content = base64_encode(file_get_contents($request->input("file")));

                }else{

                    $content = base64_encode(file_get_contents(Storage::disk('local')->path($request->input("file"))));
                }
                $d = "false";
                if(strpos($request->input("mime"),"image")>=0 || strpos($request->input("mime"),"video")>=0){
                    $d = "true";
                }
                $url = 'https://api.whatsive.com/aliance/';
                $data = array(
                    'secret' => $secret,
                    'action' => 'sendMessage',
                    'isFile' => 'true',
                    'description'=>$d,
                    'mimetype'=>$request->input("mime"),
                    "namefile"=>(is_null($request->input("namefile"))? "documento":$request->input("namefile")),
                    'file'=>$content,
                    'message' => $message,
                    'recipient' => $request->input("id"),
                    'idVerification'=>$unique,
                    'addr'=>$instancia->addr,
                    'port'=>$instancia->port
                );

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                
                $response = curl_exec($ch);
                $response = json_decode($response);
                
                if($response->salida != "success"){
                    return json_encode(["salida"=>"error","message"=>"Error al enviar el mensaje"]);
                }
                if (curl_errno($ch)) {
                    return json_encode(["salida"=>"error","message"=>"No se pudo enviar el mensaje"]);
                }
                curl_close($ch);

                $chat =  json_decode(json_encode($response->chat),true);
                $typechats = [
                    "video"=> "  <span class = 'fas fa-video fa-lg' ></span> Video",
                    "ptt"=> "  <span class = 'fas fa-microphone fa-lg' ></span> Audio",
                    "audio"=> "  <span class = 'fas fa-microphone fa-lg' ></span> Audio",
                    "image"=> "  <span class = 'fas fa-image fa-lg' ></span> Imagen",
                    "sticker"=> "  <span class = 'fas fa-file fa-lg' ></span> Sticker",
                    "document"=> "  <span class = 'fas fa-file-archive fa-lg' ></span> Archivo",
                    "location"=> "  <span class = 'fas fa-map fa-lg' ></span> Ubicacion",
                    "call_log"=> "  <span style = 'color:red' class = 'fa fa-phone fa-lg' ></span> Llamada perdida ",
                    "e2e_notification" =>"Respuesta automatica",
                    "ciphertext" => "  <span class = 'fas fa-microphone fa-lg' ></span> Audio",
                    "revoked" => "<span class = 'fa fa-ban fa-lg' ></span> Elimino el mensaje",
                    "vcard" => "<span class = 'fa fa-user fa-lg' ></span> Contacto",
                    "notification_template" => "<span class = 'fa fa-clock-o fa-lg' ></span> Aviso whatsapp",
                    "gp2" => "<span class = 'fa fa-clock-o fa-lg' ></span> Aviso whatsapp",
                ];
                if(!isset($chat["timestamp"])){
                    $chat["timestamp"] = strtotime(date("Y-m-d H:i:s")." -30 days");
                }
                $hora = date("Y-m-d H:i:s",$chat["timestamp"]);

                if(isset($chat['lastMessage'])){
                    if($chat['lastMessage']["type"] != "chat"){
                        $chat['lastMessage']["body"] = $typechats[$chat['lastMessage']["type"]];
                    }
                    DB::statement("UPDATE `chats_whatsapp` SET `last_message`= '".str_replace("'","\"",$chat['lastMessage']["body"])."', `last_update`='".$hora."', `notRead`='0', `fromMe`='1' WHERE `number`= '".explode("@",$request->input("id"))[0]."' ");
                    return json_encode(["salida"=>"success","message"=>"mensaje enviado correctamente","from"=>$request->input("id"),"body"=>str_replace("'","\"",$chat['lastMessage']["body"]),"type"=>$chat['lastMessage']["type"],"timestamp"=>strtotime($hora)]);
                }else{
                    DB::statement("UPDATE `chats_whatsapp` SET `last_message`= '', `last_update`='".$hora."', `notRead`='0', `fromMe`='1' WHERE `number`= '".explode("@",$request->input("id"))[0]."' ");
                    return json_encode(["salida"=>"success","message"=>"mensaje enviado correctamente","from"=>$request->input("id"),"body"=>"","type"=>"chat","timestamp"=>strtotime($hora)]); 
                }


                
                
                
                break;
            case 'getChats':
                $instancia = DB::table("instancia")
                                        ->first();
                                      
                $secret = "sk_wh47s1v3"; //no borrar, id para seguridad
                $url = 'https://api.whatsive.com/aliance/';
                $data = array(
                    'secret' => $secret,
                    'action' => 'getChats',
                    'idVerification'=>$unique,
                    'addr'=>$instancia->addr,
                    'port'=>$instancia->port
                );

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                
                $response = curl_exec($ch);
                $response = json_decode($response);
                if($response->salida != "success"){
                    return json_encode(["salida"=>"error","message"=>$response->message]);
                }
                if (curl_errno($ch)) {
                    return json_encode(["salida"=>"error","message"=>"No se pudieron recuperar los mensajes de la instancia"]);
                }
                curl_close($ch);
                DB::statement('DELETE FROM `chats_whatsapp`');
                foreach (json_decode($response->chats,true) as $chat) {
                    $typechats = [
                        "video"=> "  <span class = 'fas fa-video fa-lg' ></span> Video",
                        "ptt"=> "  <span class = 'fas fa-microphone fa-lg' ></span> Audio",
                        "audio"=> "  <span class = 'fas fa-microphone fa-lg' ></span> Audio",
                        "image"=> "  <span class = 'fas fa-image fa-lg' ></span> Imagen",
                        "sticker"=> "  <span class = 'fas fa-file fa-lg' ></span> Sticker",
                        "document"=> "  <span class = 'fas fa-file-archive fa-lg' ></span> Archivo",
                        "location"=> "  <span class = 'fas fa-map fa-lg' ></span> Ubicacion",
                        "call_log"=> "  <span style = 'color:red' class = 'fa fa-phone fa-lg' ></span> Llamada perdida ",
                        "e2e_notification" =>"Respuesta automatica",
                        "ciphertext" => "  <span class = 'fas fa-microphone fa-lg' ></span> Audio",
                        "revoked" => "<span class = 'fa fa-ban fa-lg' ></span> Elimino el mensaje",
                        "vcard" => "<span class = 'fa fa-user fa-lg' ></span> Contacto",
                        "notification_template" => "<span class = 'fa fa-clock-o fa-lg' ></span> Aviso whatsapp",
                        "gp2" => "<span class = 'fa fa-clock-o fa-lg' ></span> Aviso whatsapp",
                    ];
                    if($chat['id']['user'] == "status"){
                        continue;
                    }
                    if($chat["isGroup"]){
                        continue;
                    }
                    if(!isset($chat["timestamp"])){
                        $chat["timestamp"] = strtotime(date("Y-m-d H:i:s")." -30 days");
                    }
                    try {
                        $hora = date("Y-m-d H:i:s",$chat["timestamp"]);
                        if(isset($chat['lastMessage'])){
                            if($chat['lastMessage']["type"] != "chat"){
                                $chat['lastMessage']["body"] = $typechats[$chat['lastMessage']["type"]];
                            }
                            DB::statement("INSERT INTO `chats_whatsapp` (`number`,`name`,`last_update`,`asigned_to`,`last_message`,`type`,`notRead`,`photo`) values('".$chat['id']['user']."','".(isset($chat["contact"]['name'])?$chat["contact"]['name']:$chat['id']['user'])."','".$hora."','0','".str_replace("'","\"",$chat['lastMessage']["body"])."', '".$chat['lastMessage']["type"]."','".$chat["unreadCount"]."','".(!isset($chat["picUrl"]) || is_null($chat["picUrl"])?"https://ramenparados.com/wp-content/uploads/2019/03/no-avatar-png-8.png":$chat["picUrl"])."')");
                        }else{
                            DB::statement("INSERT INTO `chats_whatsapp` (`number`,`name`,`last_update`,`asigned_to`,`last_message`, `notRead`,`photo`) values('".$chat['id']['user']."','".(isset($chat["contact"]['name'])?$chat["contact"]['name']:$chat['id']['user'])."','".$hora."','0','','".$chat["unreadCount"]."','".(!isset($chat["picUrl"]) || is_null($chat["picUrl"])?"https://ramenparados.com/wp-content/uploads/2019/03/no-avatar-png-8.png":$chat["picUrl"])."') ");
                        }
                    } catch (\Throwable $th) {
                        //throw $th;
                    }
                    
                   

                }
                return json_encode(["salida"=>"success","message"=>"Instancia iniciada correctamente"]);
                break;
            case 'create':
                
                $secret = "sk_wh47s1v3"; //no borrar, id para seguridad
                $url = 'https://api.whatsive.com/aliance/';
                $data = array(
                    'secret' => $secret,
                    'action' => 'create',
                    'idVerification'=>$unique,
                    'addr'=>$request->input("addr")
                );
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                
                $response = curl_exec($ch);
                $response = json_decode($response);
                if($response->salida != "success"){
                    return json_encode(["salida"=>"error","message"=>$response->message]);
                }
                if (curl_errno($ch)) {
                    return json_encode(["salida"=>"error","message"=>"la instancia no pudo ser creada"]);
                }
                curl_close($ch);
                
                DB::statement("INSERT INTO `instancia` (`port`, `unique`, `status`, `addr`) values('".$response->puerto."','".$response->unique."','0','".$request->input("addr")."')");
                return json_encode(["salida"=>"success","message"=>"Instancia creada correctamente"]);
                break;
            
            case "reloadInstancia":
                $instancia = DB::table("instancia")
                                        ->first();
                DB::statement("UPDATE instancia set `status`= '0'");
                $secret = "sk_wh47s1v3"; //no borrar, id para seguridad
                $url = 'https://api.whatsive.com/aliance/';
                $data = array(
                    'secret' => $secret,
                    'action' => 'reload',
                    'idVerification'=>$unique,
                    'port'=>$instancia->port,
                    'addr'=>$instancia->addr
                );
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                
                $response = curl_exec($ch);
                $response = json_decode($response);
                
                if(isset($response->salida) && $response->salida != "success"){
                    return json_encode(["salida"=>"error","message"=>$response->message]);
                }
                if (curl_errno($ch)) {
                    return json_encode(["salida"=>"error","message"=>"la instancia no pudo ser creada"]);
                }
                return json_encode(["salida"=>"success","message"=>"Instancia reiniciada correctamente"]);
                curl_close($ch);
                break;
            default:
                # code...
                break;
        }
    }
}
 