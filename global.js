/*Code by android developers start here*/

var startLoc = null;
//var contentName = '152';
//step 1:-
var contentName = parseInt(localStorage.getItem("currentbrand"));
var currentContentId  = parseInt(localStorage.getItem('currentcontent'));
//ends
checkClickThrough();

document.getElementById("main_content").addEventListener("touchmove", touchHandler, false);
document.getElementById("main_content").addEventListener("touchstart", touchHandler, false);
function touchHandler(e) {

	if (e.type == "touchstart") {

			 if( e.touches.length == 1 ) { // one finger touch
			 	var touch = e.touches[ 0 ];
			 	startLoc = { x : touch.pageX, y : touch.pageY };
			 }

			} else if (e.type == "touchmove") {
				if( startLoc ) {
					var touch = e.touches[ 0 ];

					if( Math.abs( startLoc.x - touch.pageX ) > Math.abs( startLoc.y - touch.pageY ) )
					{
						e.preventDefault();
					}
					startLoc = null;
				}

			}
		}
		/*Code by android developers ends here*/
		$(document).ready(function(){

			var ua = navigator.userAgent;
	//var event = "touchstart";
	var event = (ua.match(/Ipad/i)) ? "touchstart" : "click";


	$(".left_arrow").click(function(event) {
		go_nav('b');
	});

	$(".right_arrow").click(function(event) {
		go_nav('f');
	});

	$(".slides").click(function(){
		var slideNum =	$(this).index()+1;
		console.log(slideNum);
		open_page("",slideNum);

	});

	$(".reference").removeClass("active");

	$('.reference').on('swipeleft swiperight', function(event) {
		event.stopPropagation();
	});

	$(".box_btn").bind("click",function(){
		$(".reference").toggleClass("active");
	});

	currentSlide();

		$("#main_content").swipe({
	   swipeLeft:function(event, direction, distance, duration, fingerCount) {
		
		//alert("swipeleft");
		//myconsole("swipeleft");
		var page_id =  parseInt($("#wrapper").attr("rel"));
		var last_page_id = $(".slides").length;
		var slide_jumper_open = $(".reference").hasClass("active");
		if(page_id == last_page_id+1)	{
			return
		} else{
			go_nav('f');
		}
	  },

	  swipeRight:function(event, direction, distance, duration, fingerCount) {
		
			//alert("swiperight");
		//myconsole("swiperight");
		var page_id =  parseInt($("#wrapper").attr("rel"));
		var slide_jumper_open = $(".reference").hasClass("active");

		if(page_id == 0){
			//console.log("First Slide");
			//myconsole("First Slide");
			return
		} else {
			go_nav('b');
		}

	  } ,

        //Default is 75px, set to 0 for demo so any distance triggers swipe
         threshold:0
	});
});

function go_nav(direction) {
var page_id =  parseInt($("#wrapper").attr("rel"));
			
		
var flag=0;
if(direction == 'b') {


	if(page_id >= 0){
		page_id = page_id - 1;
		//alert(page_id);
		//console.log(page_id);
		if(page_id == 0){
            flag=2;
        }
	}
	 if(flag == 2){
        localStorage.setItem("gotoNextPrevBrand" ,2);//if one than next if 2 than prev
        //flag == 0;
		var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };

	//window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe
	
		//window.location = "js-call:" + "1" + ":" + encodeURIComponent(JSON.stringify({query:'NODATA', type:'brandNavigation', callback:'checkLastPgFn'}));
    }else{
        localStorage.setItem("gotoNextPrevBrand" ,0);
		var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };

	//window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe
	}
	
}else {
	

	if(page_id <= 7){
		page_id = page_id + 1;
		//alert(page_id);
		if(page_id == 8){
            flag=1;
        }
	}
	    if(flag == 1){
        localStorage.setItem("gotoNextPrevBrand" ,1);//if one than next if 2 than prev
         flag == 0;
		 var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };


	//window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe
		 //window.location = "js-call:" + "1" + ":" + encodeURIComponent(JSON.stringify({query:'NODATA', type:'brandNavigation', callback:'checkLastPgFn'}));
    }else{
        localStorage.setItem("gotoNextPrevBrand" ,0);
		var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };

	//window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe
  
    }


}



$("#wrapper").attr("rel",page_id);

var content="";
if(flag==0){
var pg_content = set_pg_content(page_id);

	$("#main_content").html(pg_content);
}
	//console.log("pg : "+page_id);
	if(page_id==4){
		/* $(".box2").click(function(event) {
			open_page("",5)
		});
		$(".box3").click(function(event) {
			open_page("",6)
		});
		$(".box4").click(function(event) {
	 		open_page("",7)
	 	});
		$(".box5").click(function(event) {
	 		open_page("",8)
	 	});
		$(".box6").click(function(event) {
	 		open_page("",9)
	 	});
		$(".box7").click(function(event) {
	 		open_page("",10)
	 	});
		$(".box8").click(function(event) {
	 		open_page("",11)
	 	}); */
		
	}
	 checkClickThrough();
}

function set_pg_content(pg_id){
//step 6:-
//console.log("++++++++pg_id++++"+pg_id+"+++++++currentslide++++++"+localStorage.getItem("currentslide")+"++++++previousslide++++++"+localStorage.getItem("previousslide"));
		
$(".reference").removeClass("active");
currentSlide();
var selectedContentPath='';
switch(pg_id){
	case 1:
	content='<link rel="stylesheet" type="text/css" href="slide1/slide1.css" media="screen"/><div class="s1_1"><img src="slide1/s1_1.png" width="1024" height="768" alt=""/></div><div class="s1_2"><img src="slide1/s1_2.png"/></div><div class="s1_3"><img src="slide1/s1_3.png"/></div>';
	break;
	case 2:
	content='<link rel="stylesheet" type="text/css" href="slide2/slide2.css" media="screen"/><div class="s1_1"><img src="slide2/s1_1.png" width="1024" height="768" alt=""/></div><div class="s1_2"><img src="slide2/s1_2.png"/></div>';
	break;
	case 3:
	content='<link rel="stylesheet" type="text/css" href="slide3/slide3.css" media="screen"/><div class="s1_1"><img src="slide3/s1_1.png" width="1024" height="768" alt=""/></div><div class="s1_2"><img src="slide3/s1_2.png"/></div><div class="s1_3"><img src="slide3/s1_3.png"/></div>';
	break;
	case 4:
	content='<link rel="stylesheet" type="text/css" href="slide4/slide4.css" media="screen"/><div class="s1_1"><img src="slide4/s1_1.png" width="1024" height="768" alt=""/></div><div class="s1_2"><img src="slide4/s1_2.png"/></div>';
	break;
	case 5:
	content='<link rel="stylesheet" type="text/css" href="slide5/slide5.css" media="screen"/><div class="s1_1"><img src="slide5/s1_1.png" width="1024" height="768" alt=""/></div><div class="s1_2"><img src="slide5/s1_2.png"/></div><div class="s1_3"><img src="slide5/s1_3.png"/></div>';
	break;
	case 6:
	content='<link rel="stylesheet" type="text/css" href="slide6/slide6.css" media="screen"/><div class="s1_1"><img src="slide6/s1_1.png" width="1024" height="768" alt=""/></div><div class="s1_2"><img src="slide6/s1_2.png"/></div><div class="s1_3"><img src="slide6/s1_3.png"/></div><div class="s1_4"><img src="slide6/s1_4.png"/></div><div class="s1_5"><img src="slide6/s1_5.png"/></div>';
	break;
	case 7:
	content='<link rel="stylesheet" type="text/css" href="slide7/slide7.css" media="screen"/><div class="s1_1"><img src="slide7/s1_1.png" width="1024" height="768" alt=""/></div><div class="s1_2"><img src="slide7/s1_2.png" width="1024" height="768" alt=""/></div><div class="hit1"><img src="slide7/hit1.png"/></div><div class="hit2"><img src="slide7/hit2.png"/></div><div class="hit3"><img src="slide7/hit3.png"/></div><div class="hit4"><img src="slide7/hit4.png"/></div><div class="hit5"><img src="slide7/hit5.png"/></div><div class="hit6"><img src="slide7/hit6.png"/></div><div class="hit7"><img src="slide7/hit7.png"/></div><div class="hit8"><img src="slide7/hit8.png"/></div><div class="hit9"><img src="slide7/hit9.png"/></div><div class="hit10"><img src="slide7/hit10.png"/></div><div id="hit1" onclick="hit1()" value="2"></div><div id="hit2" onclick="hit2()"></div><div id="hit3" onclick="hit3()"></div><div id="hit4" onclick="hit4()"></div><div id="hit5" onclick="hit5()"></div><div id="hit6" onclick="hit6()"></div><div id="hit7" onclick="hit7()"></div><div id="hit8" onclick="hit8()"></div><div id="hit9" onclick="hit9()"></div><div id="hit10" onclick="hit10()"></div><input type="text" id="text">';
	break;
}

return content;

}

function showDiv() {
   document.getElementById('welcomeDiv').style.display = "block";
}
function showDiv2() {
   document.getElementById('welcomeDiv2').style.display = "block";
}


function open_page(url,page_id){
	 //alert("===openpage====");
	localStorage.getItem('currentbrand');
    localStorage.getItem('currentcontent');
    localStorage.getItem('currentcontentbrandId');
    localStorage.getItem('current');
	localStorage.setItem("gotoNextPrevBrand" ,0);
	//alert("====currentbrand======"+localStorage.getItem('currentbrand'));
	//alert("====currentcontent======"+localStorage.getItem('currentcontent'));
	//alert("====currentcontentbrandId======"+localStorage.getItem('currentcontentbrandId'));
	//alert("====current======"+localStorage.getItem('current'));
	//alert("====previousslide======"+localStorage.getItem("previousslide"));
	//alert("====page_id======"+page_id);
		var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };

	//window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe
	
	 $("#wrapper").attr("rel",page_id);
	 var content="";
	 var pg_content = set_pg_content(page_id);

	 	$("#main_content").html(pg_content);

	 if(page_id==4){
		$(".box2").click(function(event) {
			open_page("",5)
		});
		$(".box3").click(function(event) {
			open_page("",6)
		});
		$(".box4").click(function(event) {
	 		open_page("",7)
	 	});
		$(".box5").click(function(event) {
	 		open_page("",8)
	 	});
		$(".box6").click(function(event) {
	 		open_page("",9)
	 	});
		$(".box7").click(function(event) {
	 		open_page("",10)
	 	});
		$(".box8").click(function(event) {
	 		open_page("",11)
	 	});
	 }
	  checkClickThrough();
	}

	function checkClickThrough(){
	var currentslide=localStorage.getItem("currentslide");
	//alert(currentslide);
	document.getElementById("click_through").innerHTML='';

	if(currentslide == 1){
	document.getElementById("click_through").innerHTML='';
		}
    if(currentslide == 2){
	document.getElementById("click_through").innerHTML='';
		}

	}

	function checkBtns(refNum){
		switch(refNum){
			case 1:
			open_page('',1);
            break;
		}
	}

	function currentSlide(){
		var curr_id =  parseInt($("#wrapper").attr("rel"));
		$(".slides").removeClass("active");
		$(".slides:nth-child("+curr_id+")").addClass("active");
	}

	var ln = 0;
	function myconsole(msg){

		var oldMsg = "</br>"+ln+". "+$("#myconsole").html();
		ln++
		$("#myconsole").html(msg+oldMsg);
	}

function currentTimeInDatabaseFormat(){//to get current time in dd-mm-yyyy hh:mm:ss
	var year = new Date().getFullYear();
	var month = new Date().getMonth();
		month = parseInt(month)+1;
	if(month.toString().length==1){
		month="0"+month;
	}

	var date = new Date().getDate();
	if(date.toString().length==1){
		date="0"+date;
	}

	var hour = new Date().getHours();
	if(hour.toString().length==1){
		hour="0"+hour;
	}

	var minutes = new Date().getMinutes();
	if(minutes.toString().length==1){
		minutes="0"+minutes;
	}

	var seconds = new Date().getSeconds();
	if(seconds.toString().length==1){
		seconds="0"+seconds;
	}

	var duration= year+"-"+month+"-"+date+"-"+hour + ":" + minutes + ":" + seconds;
	return duration;
}

$(document).ready(function(){
	$('body').on('click','.touchbtn',function(){
		$('.right_arrow').trigger( "click" );
	})

	$(document).on('click','.btnshow',function(){
//alert('hi')
		$('.touchbtn').css("display","block");
	})
})

//----------------Javascript Code------------------//

var a = 1;

function hit1() {
	$('.hit1').css("display","block");
	$('#hit1').css("display","none");
    var textBox = document.getElementById("text");
    textBox.value = a;
    a++;
	if (textBox.value == 5) {
		$('.s1_2').css("display","block");
		$('#hit1, #hit2, #hit3, #hit4, #hit5, #hit6, #hit7, #hit8, #hit9, #hit10').css("display","none");
	}
}

function hit2() {
	$('.hit2').css("display","block");
	$('#hit2').css("display","none");
    var textBox = document.getElementById("text");
    textBox.value = a;
    a++;
	if (textBox.value == 5) {
		$('.s1_2').css("display","block");
		$('#hit1, #hit2, #hit3, #hit4, #hit5, #hit6, #hit7, #hit8, #hit9, #hit10').css("display","none");
	}
}

function hit3() {
	$('.hit3').css("display","block");
	$('#hit3').css("display","none");
    var textBox = document.getElementById("text");
    textBox.value = a;
    a++;
	if (textBox.value == 5) {
		$('.s1_2').css("display","block");
		$('#hit1, #hit2, #hit3, #hit4, #hit5, #hit6, #hit7, #hit8, #hit9, #hit10').css("display","none");
	}
}

function hit4() {
	$('.hit4').css("display","block");
	$('#hit4').css("display","none");
    var textBox = document.getElementById("text");
    textBox.value = a;
    a++;
	if (textBox.value == 5) {
		$('.s1_2').css("display","block");
		$('#hit1, #hit2, #hit3, #hit4, #hit5, #hit6, #hit7, #hit8, #hit9, #hit10').css("display","none");
	}
}

function hit5() {
	$('.hit5').css("display","block");
	$('#hit5').css("display","none");
    var textBox = document.getElementById("text");
    textBox.value = a;
    a++;
	if (textBox.value == 5) {
		$('.s1_2').css("display","block");
		$('#hit1, #hit2, #hit3, #hit4, #hit5, #hit6, #hit7, #hit8, #hit9, #hit10').css("display","none");
	}
}

function hit6() {
	$('.hit6').css("display","block");
	$('#hit6').css("display","none");
    var textBox = document.getElementById("text");
    textBox.value = a;
    a++;
	if (textBox.value == 5) {
		$('.s1_2').css("display","block");
		$('#hit1, #hit2, #hit3, #hit4, #hit5, #hit6, #hit7, #hit8, #hit9, #hit10').css("display","none");
	}
}

function hit7() {
	$('.hit7').css("display","block");
	$('#hit7').css("display","none");
    var textBox = document.getElementById("text");
    textBox.value = a;
    a++;
	if (textBox.value == 5) {
		$('.s1_2').css("display","block");
		$('#hit1, #hit2, #hit3, #hit4, #hit5, #hit6, #hit7, #hit8, #hit9, #hit10').css("display","none");
	}
}

function hit8() {
	$('.hit8').css("display","block");
	$('#hit8').css("display","none");
    var textBox = document.getElementById("text");
    textBox.value = a;
    a++;
	if (textBox.value == 5) {
		$('.s1_2').css("display","block");
		$('#hit1, #hit2, #hit3, #hit4, #hit5, #hit6, #hit7, #hit8, #hit9, #hit10').css("display","none");
	}
}

function hit9() {
	$('.hit9').css("display","block");
	$('#hit9').css("display","none");
    var textBox = document.getElementById("text");
    textBox.value = a;
    a++;
	if (textBox.value == 5) {
		$('.s1_2').css("display","block");
		$('#hit1, #hit2, #hit3, #hit4, #hit5, #hit6, #hit7, #hit8, #hit9, #hit10').css("display","none");
	}
}

function hit10() {
	$('.hit10').css("display","block");
	$('#hit10').css("display","none");
    var textBox = document.getElementById("text");
    textBox.value = a;
    a++;
	if (textBox.value == 5) {
		$('.s1_2').css("display","block");
		$('#hit1, #hit2, #hit3, #hit4, #hit5, #hit6, #hit7, #hit8, #hit9, #hit10').css("display","none");
	}
}