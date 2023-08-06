<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Hash;
use Auth;
use DB;
use Illuminate\Http\Request;

class IpValidator
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {

        /*
        //return $request;
            if($request->server("HTTP_REFERER") != "45.71.182.2" || $request->server("HTTP_REFERER") != "172.17.0.3" || $request->server("HTTP_REFERER") != "https://vive.com.co" ){
            }
            */
            //return response("fail, ip is not allowed to access on this resource");
        
        if(explode("?",$request->getRequestUri())[0] == "/login"){
            if(empty($request->input("username")) || empty($request->input("password") || empty($request->input("name")))){
                return response("fail, ip is not allowed to access on this resource",403);
            }else{

                if(!isset(Auth::user()->username) || (Auth::user()->username != $request->input("username"))){
                    
                    Auth::logout();
                    $password = Hash::make($request->input("password"));
                    $user = DB::table("users")
                                ->where("email","=",$request->input("username"))
                                ->first();
                    
                    if(empty($user) || is_null($user)){
                        $nombre = explode(" ",$request->input("name"));
                        $usuario = [
                            "name" => $nombre[0]." ".$nombre[1],
                            "email"=> $request->input("username"),
                            "password" => $password,
                        ];
                        DB::table("users")
                                ->insert($usuario);

                        $usuario = $request->input("username");
                        $password = $request->input("password");
                        
                        $credentials = [
                            "email"=>$usuario,
                            "password"=>$password,
                        ];
                        if(Auth::attempt($credentials)){
                            return redirect("https://vive.com.co:8443/what/whatsapp");
                        }else{
                            return back()->with("error","Usuario o Contraseña incorrecta");
                        }
                    }else{
                        $usuario = $request->input("username");
                        $password = $request->input("password");
                        
                        $credentials = [
                            "email"=>$usuario,
                            "password"=>$password,
                        ];
                        if(Auth::attempt($credentials)){
                            return redirect("https://vive.com.co:8443/what/whatsapp");
                        }else{
                            return back()->with("error","Usuario o Contraseña incorrecta");
                        }
                    }
                    //

                }

            }
        }
        
        return $next($request);
    }
}
