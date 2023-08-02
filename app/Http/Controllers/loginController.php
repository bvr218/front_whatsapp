<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Auth; 

class loginController extends Controller
{
    public function signin(Request $request){
        $usuario = $request->input("username");
        $password = $request->input("password");
        
        $credentials = [
            "email"=>$usuario,
            "password"=>$password,
        ];
        if(Auth::attempt($credentials)){
            return redirect("/whatsapp");
        }else{
            return back()->with("error","Usuario o Contraseña incorrecta");
        }
    }
}
