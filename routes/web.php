<?php

namespace App\Http\Controllers;
use App\Http\Middleware\IpValidator;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



Route::middleware([IpValidator::class])->group(function(){
    Route::group(["middleware"=>"guest"],function(){
        Route::get('/what/login',function(){
            return view("login");
        })->name("login");
        Route::get('/login',function(){
            return view("login");
        });
        Route::post('/login/signin',[loginController::class,'signin'])->name("login.signin");
    });
    
    Route::group(["middleware"=>"auth"],function(){
        Route::get('/whatsapp', [CRMController::class,'whatsapp'])->name('crm.whatsapp');
        Route::get('/closeSesion', [CRMController::class,'closeSesion'])->name('closeSesion');
        
        Route::post('/cartera/{action?}', [CRMController::class,'whatsappActions'])->name('crm.whatsapp');
    });
});
