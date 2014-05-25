$(document).ready(function(){
	var that = '';
	$(document).on('click','label.tree-toggler',function () {
		if($(this).parent().parent().children('ul.tree').is(':visible')){
			$(this).html('[+]');
		}else{
			$(this).html('[-]');
		}
		
		$(this).parent().parent().children('ul.tree').toggle(300);
	});
	$(document).on('click','.answer',function() {
		that = $(this);
		$(".ui-dialog-buttonset button").addClass("btn").addClass("btn-default");
		$(".ui-dialog-titlebar-close").html("x");
        $( "#dialog-form" ).dialog("open");
    });
    $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 300,
      width: 350,
      modal: true,
      buttons: {
        "Add comment": function() {	        	
            that.parents('div').next().append( "<li>" +
               "<div>"+
				'<p class="ng-binding">' +  $("textarea#content").val() + ' <br><span class="ng-binding">Autor:  '+ $("input#name").val() + ' | <a class="answer">Answer</a></span></p>'+
				"</div>"+
				'<ul class="nav nav-list tree"></ul>'+
            "</li>" );
           
            $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
      	$("textarea#content").val('');
      	$("input#name").val('');
      }
    });
});