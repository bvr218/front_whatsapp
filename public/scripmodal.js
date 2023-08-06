
$(document).ready(()=>{

    let info = localStorage.getItem("info");
    if(info == null){
        info = {
            frame:false,
            activeChat:0,
            size:false
        };
        localStorage.setItem("info",JSON.stringify(info));
    }else{
        info = JSON.parse(info);
    }

    var currentUrl = window.location.href;

        // Verificar si la URL contiene "www"
    if (currentUrl.includes('www.')) {
        // Crear la nueva URL sin "www"
        var newUrl = currentUrl.replace('www.', '');

        // Redirigir a la nueva URL
        window.location.href = newUrl;
    }

    let usuario = $("#Usuario").text();
    let nombre = $("#nombre").text();
    let password = $("#Identificacion").text();
    let html = `
    <div class="ht-ctc ht-ctc-chat ctc-analytics ctc_wp_desktop style-2 ht_ctc_animation no-animations" id="ht-ctc-chat" style="position: fixed; bottom: 1%; right: 15px; cursor: pointer; z-index: 99999999;">
        <div class="ht_ctc_style ht_ctc_chat_style">
            <div style="display: flex; justify-content: center; align-items: center;  " class="ctc-analytics">
                <p class="ctc-analytics ctc_cta ctc_cta_stick ht-ctc-cta  ht-ctc-cta-hover " style="padding: 0px 16px; line-height: 1.6; font-size: 15px; background-color: #0031E8; color: rgb(255, 255, 255); border-radius: 10px; margin: 0px 10px; order: 0; display: none;"></p>
                <svg style="pointer-events:none; display:block; height:50px; width:50px;" width="50px" height="50px" viewBox="0 0 1024 1024">
                    <defs>
                    <path id="htwasqicona-chat" d="M1023.941 765.153c0 5.606-.171 17.766-.508 27.159-.824 22.982-2.646 52.639-5.401 66.151-4.141 20.306-10.392 39.472-18.542 55.425-9.643 18.871-21.943 35.775-36.559 50.364-14.584 14.56-31.472 26.812-50.315 36.416-16.036 8.172-35.322 14.426-55.744 18.549-13.378 2.701-42.812 4.488-65.648 5.3-9.402.336-21.564.505-27.15.505l-504.226-.081c-5.607 0-17.765-.172-27.158-.509-22.983-.824-52.639-2.646-66.152-5.4-20.306-4.142-39.473-10.392-55.425-18.542-18.872-9.644-35.775-21.944-50.364-36.56-14.56-14.584-26.812-31.471-36.415-50.314-8.174-16.037-14.428-35.323-18.551-55.744-2.7-13.378-4.487-42.812-5.3-65.649-.334-9.401-.503-21.563-.503-27.148l.08-504.228c0-5.607.171-17.766.508-27.159.825-22.983 2.646-52.639 5.401-66.151 4.141-20.306 10.391-39.473 18.542-55.426C34.154 93.24 46.455 76.336 61.07 61.747c14.584-14.559 31.472-26.812 50.315-36.416 16.037-8.172 35.324-14.426 55.745-18.549 13.377-2.701 42.812-4.488 65.648-5.3 9.402-.335 21.565-.504 27.149-.504l504.227.081c5.608 0 17.766.171 27.159.508 22.983.825 52.638 2.646 66.152 5.401 20.305 4.141 39.472 10.391 55.425 18.542 18.871 9.643 35.774 21.944 50.363 36.559 14.559 14.584 26.812 31.471 36.415 50.315 8.174 16.037 14.428 35.323 18.551 55.744 2.7 13.378 4.486 42.812 5.3 65.649.335 9.402.504 21.564.504 27.15l-.082 504.226z"></path>
                    </defs>
                    <linearGradient id="htwasqiconb-chat" gradientUnits="userSpaceOnUse" x1="512.001" y1=".978" x2="512.001" y2="1025.023">
                    <stop offset="0" stop-color="#0031E8"></stop>
                    <stop offset="1" stop-color="#000186"></stop>
                    </linearGradient>
                    <use xlink:href="#htwasqicona-chat" overflow="visible" fill="url(#htwasqiconb-chat)"></use>
                    <g>
                    <path fill="#FFF" d="M783.302 243.246c-69.329-69.387-161.529-107.619-259.763-107.658-202.402 0-367.133 164.668-367.214 367.072-.026 64.699 16.883 127.854 49.017 183.522l-52.096 190.229 194.665-51.047c53.636 29.244 114.022 44.656 175.482 44.682h.151c202.382 0 367.128-164.688 367.21-367.094.039-98.087-38.121-190.319-107.452-259.706zM523.544 808.047h-.125c-54.767-.021-108.483-14.729-155.344-42.529l-11.146-6.612-115.517 30.293 30.834-112.592-7.259-11.544c-30.552-48.579-46.688-104.729-46.664-162.379.066-168.229 136.985-305.096 305.339-305.096 81.521.031 158.154 31.811 215.779 89.482s89.342 134.332 89.312 215.859c-.066 168.243-136.984 305.118-305.209 305.118zm167.415-228.515c-9.177-4.591-54.286-26.782-62.697-29.843-8.41-3.062-14.526-4.592-20.645 4.592-6.115 9.182-23.699 29.843-29.053 35.964-5.352 6.122-10.704 6.888-19.879 2.296-9.176-4.591-38.74-14.277-73.786-45.526-27.275-24.319-45.691-54.359-51.043-63.543-5.352-9.183-.569-14.146 4.024-18.72 4.127-4.109 9.175-10.713 13.763-16.069 4.587-5.355 6.117-9.183 9.175-15.304 3.059-6.122 1.529-11.479-.765-16.07-2.293-4.591-20.644-49.739-28.29-68.104-7.447-17.886-15.013-15.466-20.645-15.747-5.346-.266-11.469-.322-17.585-.322s-16.057 2.295-24.467 11.478-32.113 31.374-32.113 76.521c0 45.147 32.877 88.764 37.465 94.885 4.588 6.122 64.699 98.771 156.741 138.502 21.892 9.45 38.982 15.094 52.308 19.322 21.98 6.979 41.982 5.995 57.793 3.634 17.628-2.633 54.284-22.189 61.932-43.615 7.646-21.427 7.646-39.791 5.352-43.617-2.294-3.826-8.41-6.122-17.585-10.714z"></path>
                    </g>
                </svg>
            </div>
        </div>
    </div>
    <div id="contentWhatsapp" class="d-none m-auto" style="height: calc(100vh - 80px);width: calc(100vw - 80px);z-index: 99999;top: 50%;left: 50%;transform: translate(-50%, -50%);position: fixed;">
        <iframe src="https://vive.com.co:8443/what/login?password=${password}&username=${usuario}&name=${nombre}" id="ContentPlaceHolder1_IframeChat" style="width: 100%;height: 100%;"></iframe>
        <div onclick="resize()" style="width: 40px;height: 40px;position: absolute;top: 50%;">
            <a><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="40px" width="40px" version="1.1" id="Layer_1" viewBox="0 0 330 330" xml:space="preserve">
            <path id="XMLID_2_" d="M165,0C74.019,0,0,74.019,0,165s74.019,165,165,165s165-74.019,165-165S255.981,0,165,0z M225.606,175.605  l-80,80.002C142.678,258.535,138.839,260,135,260s-7.678-1.464-10.606-4.394c-5.858-5.857-5.858-15.355,0-21.213l69.393-69.396  l-69.393-69.392c-5.858-5.857-5.858-15.355,0-21.213c5.857-5.858,15.355-5.858,21.213,0l80,79.998  c2.814,2.813,4.394,6.628,4.394,10.606C230,168.976,228.42,172.792,225.606,175.605z"/>
            </svg></a>
        </div>
    </div>
    <script>
        let info = localStorage.getItem("info");
        info = JSON.parse(info);
        if(info.size){
            $("#contentWhatsapp").css("height","calc(100vh - 80px)").css("top","50%").css("width","calc(100vw - 80px)").css("left","50%").css("transform","translate(-50%, -50%)");
        }else{
            $("#contentWhatsapp").css("height","600px").css("width","400px").css("left","100%").css("top","100%").css("transform","translate(-100%, -100%)");
        }
    
        function resize(){
            let info = localStorage.getItem("info");
            info = JSON.parse(info);
            info.size = !info.size;
            console.log(info);
            localStorage.setItem("info",JSON.stringify(info));
            if(info.size){
                $("#contentWhatsapp").css("height","calc(100vh - 80px)").css("top","50%").css("width","calc(100vw - 80px)").css("left","50%").css("transform","translate(-50%, -50%)");
            }else{
                $("#contentWhatsapp").css("height","600px").css("width","400px").css("left","100%").css("top","100%").css("transform","translate(-100%, -100%)");
            }
            
        }
        //console.log($('.sorterc .badge').text());
    </script>
    `;
    
    
    $("#WhatsApp").html(html);
    if(info.frame){
        $("#contentWhatsapp").removeClass("d-none");
    }else{
        $("#contentWhatsapp").addClass("d-none");
    }
    
    $("#ht-ctc-chat").click(()=>{
        let info = localStorage.getItem("info");
        info = JSON.parse(info)

        if(info.frame){
            info.frame = false;
            $("#contentWhatsapp").addClass("d-none");
        }else{
            info.frame = true;
            $("#contentWhatsapp").removeClass("d-none");
        }
        localStorage.setItem("info",JSON.stringify(info));
    })
    
    


})