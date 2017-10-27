$(function() {
  var selectedPage = window.location.pathname.split("/").pop();
  if(selectedPage){
    var activeLink = "sel"+selectedPage;
    
    console.log(activeLink);
    
    $("#"+activeLink).addClass('active');
  }
  
  console.log(selectedPage);
});
