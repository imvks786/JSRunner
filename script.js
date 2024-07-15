var js_data;
var editor;

var controls = {
    save_work: () =>{
        localStorage.setItem('JS_DATA', js_data);
        controls.notification(true,'Code saved successfully!');
    },
    clear_work:()=>{
        localStorage.removeItem('JS_DATA');
        controls.notification(true,'Code Cleared successfully!');
    },
    notification: (show,msg) =>{
        if(show){
            $("#notification_msg").html(msg);
            $("#notify").fadeIn();
            setTimeout(()=>{
                $("#notify").fadeOut();
            },5000)
        }
        else{
            $("#notify").fadeOut();
        }
    },
    change_themes:(k)=>{
        editor.setTheme(k);
        try{
            localStorage.setItem('JS_C_THEME', k);
        }
        catch(e) {
            console.log(e);
        }
    }    
}

$(document).ready(()=>{
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            controls.save_work();
        }
    });

    $("#themes").on('change',()=>{
        controls.change_themes($("#themes").val()); 
    })


    $("#save_work").click(()=>{ controls.save_work(); })
    $("#clear_work").click(()=>{ controls.clear_work(); })
})

//===========CODE RUNNER===============//
setInterval(()=>{
    localStorage.setItem('JS_DATA', js_data);
    $(".auto_save").addClass('rotate_auto_save');
    $(".auto_msg").fadeIn();
    setTimeout(()=>{$(".auto_save").removeClass('rotate_auto_save');$(".auto_msg").fadeOut();},2000)
}, 50000);


function runCode(codes) {
    // Clear previous output
    document.getElementById('output').innerText = '';

    try {
        const code = codes;
        const scriptFunction = new Function(code);
        let capturedConsole = [];
        const consoleLog = console.log;

        console.log = (...args) => {
            capturedConsole.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
            consoleLog.apply(console, args);
        };

        
        scriptFunction();
        console.log = consoleLog;

        $('#output').html(capturedConsole.join('\n'));
        
        var div = $('#output');
        div.scrollTop(div.prop('scrollHeight'));

        // console.log(capturedConsole.join('\n'));
    } 
    catch (error) {
        $('#output').html(`<span class="error_"><b>Error: ${error.message}</b><span>`);
        console.log(error.message);
    }
}


//==============EDITOR=================//
$(document).ready(()=>{
    editor = ace.edit("editor");
    var c_theme = "ace/theme/monokai";
    try{
        c_theme = localStorage.getItem('JS_C_THEME');
        if(!c_theme) {
            c_theme= "ace/theme/monokai";
        }
    }
    catch{
        console.log("NO THEME");
    }

    editor.setTheme(c_theme);
    var themes = ace.require("ace/ext/themelist").themes;


    console.log(themes);
    
    themes.forEach(theme => { $("#themes").append(`<option value="${theme.theme}">${theme.caption}</option>`); });
    editor.session.setMode("ace/mode/javascript"); // Set the programming language mode

    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        fontSize: "14px",
        showPrintMargin: false // Hide the vertical line at the end of the editor
    });


    editor.session.on('change', function(delta) {
        js_data = editor.getValue();
        runCode(js_data);
    });


    try{
       js_data =  localStorage.getItem('JS_DATA');
       if(!js_data) {
            js_data= `// CODE HERE;`;
        }
    }
    catch(e){
        console.log('NO DATA');
    }

    editor.session.setValue(js_data);
    editor.focus();
});