$(function() {
  var selectedPage = window.location.pathname.split("/").pop();
  if(selectedPage){
    var activeLink = "sel"+selectedPage;
    
    console.log(activeLink);
    
    $("#"+activeLink).addClass('active');
  }
  
  console.log(selectedPage);
});

$(document).ready(function () {

    //Set Theme
    if (sessionStorage.myTheme) {
        $('#themeCSS').attr('href', '/Themes/' + sessionStorage.myTheme + '/Styles/theme.css');
        var optionValue = sessionStorage.myTheme;
        $('#themeValue').val(optionValue).find("option[value="+ optionValue +"]").attr('selected',true);
        console.log("myTheme =" + sessionStorage.myTheme);
    } else {
        console.log("myTheme is null");
    }
    
    $("#saveTheme").click(function () {
        sessionStorage.myTheme = $('#themeValue').find(":selected").text();
        
        $('#themeCSS').attr('href', '/Themes/' + sessionStorage.myTheme + '/Styles/theme.css');
        console.log(sessionStorage.myTheme);
    });
    $("#clearTheme").click(function () {
        sessionStorage.myTheme = "";
        console.log("Cleared" + sessionStorage.myTheme);
        location.reload();
    });
    
    var clipboardDemos=new Clipboard('[data-clipboard-demo]');
    clipboardDemos.on('success',function(e){e.clearSelection();
    console.info('Action:',e.action);console.info('Text:',e.text);
    console.info('Trigger:',e.trigger);showTooltip(e.trigger,'Copied!');});
    clipboardDemos.on('error',function(e){console.error('Action:',e.action);
    console.error('Trigger:',e.trigger);showTooltip(e.trigger,fallbackMessage(e.action));});

});