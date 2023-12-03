/*Code by android developers start here*/
var startLoc = null;
//var contentName = '152';
//step 1:-
var contentName = parseInt(localStorage.getItem("currentbrand"));
var currentContentId  = parseInt(localStorage.getItem('currentcontent'));
//ends
var currentContentNSlide ='';

//custom slides changes begins here....

//alert("++++++++++++"+custcomslideflag1+"+++++++custcomslideid+++++++"+custcomslideid1);
	if (typeof(localStorage.getItem("currentcustomslideflag"))!='undefined' &&  localStorage.getItem("currentcustomslideflag") =='true'){
		var custcomslideid1=parseInt(localStorage.getItem("currentcontentcustomslideId"));
		//step 2:

		currentContentNSlide = currentContentId+"_"+contentName+"_"+custcomslideid1;
		//step 2 ends here
		localStorage.setItem("current",currentContentNSlide);
		localStorage.setItem("currentslide",custcomslideid1);

	}else{
		//step 3 :
		currentContentNSlide = currentContentId+"_"+contentName+"_"+'1';
		//step 3 ends here
		localStorage.setItem("current",currentContentNSlide);
		localStorage.setItem("currentslide",'1');
	}
	
//custom slides changes ends here....

/* currentContentNSlide = contentName+"_"+'1';
localStorage.setItem("current",currentContentNSlide);
localStorage.setItem("currentslide",'1'); */
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
		
		if(page_id == 6){
			open_page("",4)
		}
		if(page_id == 10){
			open_page("",6)
		}
		if(page_id == 12){
			open_page("",10)
		}
	});

	$(".right_arrow").click(function(event) {
		go_nav('f');
		
		if(page_id == 4){
			open_page("",6)
		}
		if(page_id == 6){
			open_page("",10)
		}
		if(page_id == 10){
			open_page("",12)
		}
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
		//step 4:-
		console.log("swipeleft"+localStorage.getItem("currentslide"));
		localStorage.setItem("previousslide",localStorage.getItem("currentslide"));
		//step 4 ends here
		//alert("swipeleft");
		//myconsole("swipeleft");
		var page_id =  parseInt($("#wrapper").attr("rel"));
		var last_page_id = $(".slides").length;
		var slide_jumper_open = $(".reference").hasClass("active");
		if(page_id == last_page_id+1)	{
			return
		} else{
			go_nav('f');
			
			if(page_id == 4){
				open_page("",6)
			}
			if(page_id == 6){
				open_page("",10)
			}
			if(page_id == 10){
				open_page("",12)
			}
		}
	  },

	  swipeRight:function(event, direction, distance, duration, fingerCount) {
		//step 5:-
		console.log("swiperight"+localStorage.getItem("currentslide"));
		localStorage.setItem("previousslide",localStorage.getItem("currentslide"));
		//step 5 ends here 
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
			
			if(page_id == 6){
				open_page("",4)
			}
			if(page_id == 10){
				open_page("",6)
			}
			if(page_id == 12){
				open_page("",10)
			}
		}

	  } ,

        //Default is 75px, set to 0 for demo so any distance triggers swipe
         threshold:0
	});
});

//step 6:-
function toCaptureTime(page_id){
	
	var currentSlideNo = page_id;

	var startTime = Date.now();


	var temp = localStorage.getItem(currentContentId+"_"+contentName+"_slideNo_"+currentSlideNo);
	
	if(temp == null){
		
		if (currentSlideNo!=0){
			localStorage.setItem(currentContentId+"_"+contentName+"_slideNo_"+currentSlideNo ,startTime);

			//to capture start time of slide in db format
			var startTimeInDBFormat = currentTimeInDatabaseFormat();
			//alert(startTimeInDBFormat);

			localStorage.setItem(currentContentId+"_"+contentName+"_StartTime_"+currentSlideNo ,startTimeInDBFormat);
		}
}
else
{

var existingTime = localStorage.getItem(currentContentId+"_"+contentName+"_slideNo_"+currentSlideNo);
var newTime = Date.now();
var newSlideTime = (newTime - existingTime);

// alert(currentSlideNo + " slide time : " + (newSlideTime/1000) ); // time taken to view that particular slide

//to capture end time of slide in db format
var endTimeInDBFormat = currentTimeInDatabaseFormat();
//alert(endTimeInDBFormat);/* 
/* 
alert('do calculations and update time====else==_EndTime_======'); */


var EndTimeNext = localStorage.getItem(currentContentId+"_"+contentName+"_EndTime_"+currentSlideNo);
console.log("++++++++EndTimeNext++++++++"+EndTimeNext+"++++++currentContentId+++"+currentContentId+"_"+contentName+"_EndTime_"+currentSlideNo);
if(EndTimeNext == null){
	//this time for which the slide was viewed


localStorage.setItem(currentContentId+"_"+contentName+"_totalTime_slideNo_"+currentSlideNo ,(newSlideTime/1000) );


localStorage.setItem(currentContentId+"_"+contentName+"_EndTime_"+currentSlideNo ,endTimeInDBFormat);
}

if (typeof(localStorage.getItem('currentslide'))!='undefined' && localStorage.getItem('currentslide')!='' && localStorage.getItem('currentslide')>= currentSlideNo){


	var nextSlideNo = currentSlideNo;

}else{


	var nextSlideNo = currentSlideNo + 1 ;
	
 } 
 
	if(nextSlideNo <= 11){//number 3 is number of total slides present
	// alert(nextSlideNo);
	var tempNext = localStorage.getItem(currentContentId+"_"+contentName+"_slideNo_"+nextSlideNo);

		if(tempNext == null){
			
			if (nextSlideNo!=0)	{
				var nextSlideStartTime =  Date.now();
				localStorage.setItem(currentContentId+"_"+contentName+"_slideNo_"+nextSlideNo ,nextSlideStartTime);
				localStorage.setItem(currentContentId+"_"+contentName+"_totalTime_slideNo_"+nextSlideNo ,0);



				//to capture start time of next slide in db format
				var startTimeNextInDBFormat = currentTimeInDatabaseFormat();
				//alert(startTimeNextInDBFormat);
				/* 
				alert("+++else++_StartTime_++++currentSlideNo++++"+nextSlideNo); */
				localStorage.setItem(currentContentId+"_"+contentName+"_StartTime_"+nextSlideNo ,startTimeNextInDBFormat);
			}
		}
	}
}

}
//step ends..


function go_nav(direction) {
	//alert("+++++++++go_nav++++++++++"+direction);
	//alert("+++++++++go_nav++++contentName++++++"+contentName);
	//go_nav('b');right
	//go_nav('f');left
	
//custom slide changes continues here....
	
	if (typeof(localStorage.getItem("currentcustomslideflag"))!='undefined' &&   localStorage.getItem("currentcustomslideflag") =='true'){

			
				var custcomslideid=parseInt(localStorage.getItem("currentcontentcustomslideId"));
			
				
				var page_id =  custcomslideid;
		}else{
			
				var page_id =  parseInt($("#wrapper").attr("rel"));
		}	
		
//custom slide changes ends here....

	//step 7:-
	//toCaptureTime(page_id);
	console.log("swipeleft"+localStorage.getItem("currentslide"));
	localStorage.setItem("previousslide",localStorage.getItem("currentslide"));
	//step 7 ends here
//localStorage.setItem(contentName+"_slideNo_"+currentSlideNo ,n);
var flag=0;
if(direction == 'b') {

//custom slide changes continues here....

		//alert("+++++bhitor reee +++++++"+custcomslideflag+"+++++++custcomslideid+++++++"+custcomslideid);
	if (typeof(localStorage.getItem("currentcustomslideflag"))!='undefined' &&    localStorage.getItem("currentcustomslideflag") =='true'){
		flag==0
		localStorage.setItem("gotoNextPrevBrand" ,2);//if one than next if 2 than prev
		window.location = "js-call:" + "1" + ":" + encodeURIComponent(JSON.stringify({query:'NODATA', type:'brandNavigation', callback:'checkLastPgFn'}));


	}
	
//custom slide changes ends here....

	else{
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
		window.location = "js-call:" + "1" + ":" + encodeURIComponent(JSON.stringify({query:'NODATA', type:'brandNavigation', callback:'checkLastPgFn'}));
    }else{
        localStorage.setItem("gotoNextPrevBrand" ,0);
    }

	}
}else {
	
//custom slide changes continues here....

	if (typeof(localStorage.getItem("currentcustomslideflag"))!='undefined' && localStorage.getItem("currentcustomslideflag") =='true'){
		flag==0
		localStorage.setItem("gotoNextPrevBrand" ,1);//if one than next if 2 than prev

		window.location = "js-call:" + "1" + ":" + encodeURIComponent(JSON.stringify({query:'NODATA', type:'brandNavigation', callback:'checkLastPgFn'}));
	}
	
//custom slide changes ends here....

	else{
	if(page_id <= 11){
		page_id = page_id + 1;
		//alert(page_id);
		if(page_id == 12){
            flag=1;
        }
	}
	    if(flag == 1){
        localStorage.setItem("gotoNextPrevBrand" ,1);//if one than next if 2 than prev
         flag == 0;
		 window.location = "js-call:" + "1" + ":" + encodeURIComponent(JSON.stringify({query:'NODATA', type:'brandNavigation', callback:'checkLastPgFn'}));
    }else{
        localStorage.setItem("gotoNextPrevBrand" ,0);
    }

}
}


//step 8:
currentContentNSlide = currentContentId+"_"+contentName+"_"+page_id;
//step 8 ends here
localStorage.setItem("current",currentContentNSlide);
localStorage.setItem("currentslide",page_id);

$("#wrapper").attr("rel",page_id);

var content="";
if(flag==0){
var pg_content = set_pg_content(page_id);

	$("#main_content").html(pg_content);
}
	//console.log("pg : "+page_id);
	if(page_id==null){
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

function set_pg_content(pg_id){
//step 6:-
//console.log("++++++++pg_id++++"+pg_id+"+++++++currentslide++++++"+localStorage.getItem("currentslide")+"++++++previousslide++++++"+localStorage.getItem("previousslide"));
		 //check previous slide id end time capture...@bramha..
		 //check previous slide id end time capture...@bramha..
	//step 9:
	if (typeof(localStorage.getItem("previousslide"))!='undefined'){
		//to checked previous slide has god end time...
		var previousslideid=localStorage.getItem("previousslide");
		toCaptureTime(previousslideid);
		
	}
	toCaptureTime(pg_id);


	//step 9 ends here..
//alert("++++++++++set_pg_content++++++++++"+pg_id);
$(".reference").removeClass("active");
currentSlide();
var selectedContentPath='';
switch(pg_id){
	case 1:
	content='<link rel="stylesheet" type="text/css" href="slide1/slide1.css" media="screen"/><div class="s1_1"><img src="slide1/s1_1.png" width="1080" height="810" alt=""></div><div class="s1_2"><img src="slide1/s1_2.png"/></div><div class="s1_3"><img src="slide1/s1_3.png"/></div><div class="s1_4"><img src="slide1/s1_4.png"/></div><div class="s1_5"><img src="slide1/s1_5.png"/></div><div class="s1_6"><img src="slide1/s1_6.gif"/></div><div class="s1_7"><img src="slide1/s1_7.gif"/></div><div class="s1_8"><img src="slide1/s1_8.gif"/></div><div class="s1_9"><img src="slide1/s1_9.png"/></div><div class="principle" onclick="checkBtns(7)"></div>';
	break;
	case 2:
	content='<link rel="stylesheet" type="text/css" href="slide2/slide2.css" media="screen"/><div class="spin1" onclick="spin1()"></div><div class="s2_1"><img src="slide2/s2_1.png" width="1080" height="810" alt=""></div><div class="s2_2"><img src="slide2/s2_2.png"/></div><div class="s2_3"><img src="slide2/s2_3.png"/></div><div class="spin2" onclick="spin2()"></div><div class="s2_4"><img src="slide2/s2_4.png" width="1080" height="810" alt=""></div><div class="s2_5"><img src="slide2/s2_5.png"/></div><div class="s2_6"><img src="slide2/s2_6.png"/></div><div class="spin3" onclick="spin3()"></div><div class="s2_7"><img src="slide2/s2_7.png" width="1080" height="810" alt=""></div><div class="s2_8"><img src="slide2/s2_8.png"/></div><div class="s2_9"><img src="slide2/s2_9.png"/></div>';
	break;
	case 3:
	content='<link rel="stylesheet" type="text/css" href="slide3/slide3.css" media="screen"/><div class="s3_vid"><video width="1080" height="810" autoplay controls><source src="slide3/s3_vid1.mp4" type="video/mp4"></video></div>';
	break;
	case 4:
	content='<link rel="stylesheet" type="text/css" href="slide4/slide4.css" media="screen"/><div class="s4_1"><img src="slide4/s4_1.png" width="1080" height="810" alt=""></div><div class="s4_2"><img src="slide4/s4_2.png"/></div><div class="s4_3"><img src="slide4/s4_3.png"/></div><div class="s4_4"><img src="slide4/s4_4.png"/></div><div class="s4_5"><img src="slide4/s4_5.png"/></div><div class="s4_6"><img src="slide4/s4_6.png"/></div><div class="s4_7"><img src="slide4/s4_7.png"/></div><div class="s4_8"><img src="slide4/s4_8.png"/></div><div class="s4_9"><img src="slide4/s4_9.png"/></div><div class="s4_10"><img src="slide4/s4_10.png"/></div><div class="video" onclick="checkBtns(7)"></div><div class="posology" onclick="checkBtns(1)"></div><div class="nodeds" onclick="checkBtns(4)"></div><div class="nodeg" onclick="checkBtns(6)"></div>';
	break;
	case 5:
	content='<link rel="stylesheet" type="text/css" href="slide5/slide5.css" media="screen"/><div class="s5_1"><img src="slide5/s5_1.png" width="1080" height="810" alt=""></div><div class="s5_2_wrap"><div class="s5_2"><img src="slide5/s5_2.png"/></div></div><div class="s5_3_wrap"><div class="s5_3"><img src="slide5/s5_3.png"/></div></div><div class="s5_4_wrap"><div class="s5_4"><img src="slide5/s5_4.png"/></div></div><div class="s5_vid1"><video width="587" height="330" autoplay controls><source src="slide5/s5_vid1.mp4" type="video/mp4"></video>';
	break;
	case 6:
	content='<link rel="stylesheet" type="text/css" href="slide6/slide6.css" media="screen"/><div class="s6_1"><img src="slide6/s6_1.png" width="1080" height="810" alt=""></div><div class="s6_2"><img src="slide6/s6_2.png"/></div><div class="s6_3"><img src="slide6/s6_3.png"/></div><div class="s6_4"><img src="slide6/s6_4.png"/></div><div class="s6_5"><img src="slide6/s6_5.png"/></div><div class="s6_6"><img src="slide6/s6_6.png"/></div><div class="s6_7"><img src="slide6/s6_7.png"/></div><div class="s6_8"><img src="slide6/s6_8.png"/></div><div class="posology" onclick="checkBtns(3)"></div><div class="study1" onclick="checkBtns(8)"></div><div class="study2" onclick="checkBtns(9)"></div><div class="nodefluid" onclick="checkBtns(2)"></div><div class="nodeg" onclick="checkBtns(6)"></div>';
	break;
	case 7:
	content='<link rel="stylesheet" type="text/css" href="slide7/slide7.css" media="screen"/><div class="s7_1"><img src="slide7/s7_1.png" width="1080" height="810" alt=""></div><div class="s7_2"><img src="slide7/s7_2.png"/></div><div class="s7_3"><img src="slide7/s7_3.png"/></div><div class="s7_4"><img src="slide7/s7_4.png"/></div>';
	break;
	case 8:
	content='<link rel="stylesheet" type="text/css" href="slide8/slide8.css" media="screen"/><div class="s8_1"><img src="slide8/s8_1.png" width="1080" height="810" alt=""></div><div class="s8_2"><img src="slide8/s8_2.png"/></div><div class="s8_3"><img src="slide8/s8_3.png"/></div>';
	break;
	case 9:
	content='<link rel="stylesheet" type="text/css" href="slide9/slide9.css" media="screen"/><div class="s9_1"><img src="slide9/s9_1.png" width="1080" height="810" alt=""></div><div class="s9_2"><img src="slide9/s9_2.png"/></div><div class="s9_3"><img src="slide9/s9_3.png"/></div><div class="s9_4"><img src="slide9/s9_4.png"/></div><div class="s9_5"><img src="slide9/s9_5.png"/></div><div class="s9_6"><img src="slide9/s9_6.png"/></div><div class="s9_7"><img src="slide9/s9_7.png"/></div><div class="s9_8"><img src="slide9/s9_8.png"/></div><div class="s9_9"><img src="slide9/s9_9.png"/></div><div class="s9_10"><img src="slide9/s9_10.png"/></div><div class="home" onclick="checkBtns(4)"></div>';
	break;
	case 10:
	content='<link rel="stylesheet" type="text/css" href="slide10/slide10.css" media="screen"/><div class="s10_1"><img src="slide10/s10_1.png" width="1080" height="810" alt=""/></div><div class="s10_2"><img src="slide10/s10_2.png"/></div><div class="s10_3"><img src="slide10/s10_3.png"/></div><div class="s10_4"><img src="slide10/s10_4.png"/></div><div class="s10_5"><img src="slide10/s10_5.png"/></div><div class="s10_6"><img src="slide10/s10_6.png"/></div><div class="s10_7"><img src="slide10/s10_7.png"/></div><div class="posology" onclick="checkBtns(5)"></div><div class="nodefluid" onclick="checkBtns(2)"></div><div class="nodeds" onclick="checkBtns(4)"></div>';
	break;
	case 11:
	content='<link rel="stylesheet" type="text/css" href="slide11/slide11.css" media="screen"/><div class="s11_1"><img src="slide11/s11_1.png" width="1080" height="810" alt=""></div><div class="s11_2"><img src="slide11/s11_2.png"/></div><div class="s11_3"><img src="slide11/s11_3.png"/></div><div class="s11_4"><img src="slide11/s11_4.png"/></div><div class="s11_5"><img src="slide11/s11_5.png"/></div><div class="s11_6"><img src="slide11/s11_6.png"/></div><div class="s11_7"><img src="slide11/s11_7.png"/></div><div class="s11_8"><img src="slide11/s11_8.png"/></div><div class="home" onclick="checkBtns(6)"></div>';
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
	 // alert(page_id);
	//step 10:
	if (typeof(localStorage.getItem("currentslide"))!='undefined'){
		//to checked previous slide has god end time...
		var slideid=localStorage.getItem("currentslide");
		toCaptureTime(slideid);
		
	}
	
	// toCaptureTime(page_id);
	 localStorage.setItem("currentslide",page_id);
	 currentContentNSlide = currentContentId+"_"+contentName+"_"+page_id;
	 localStorage.setItem("current",currentContentNSlide);
	//step 10 ends here

	 $("#wrapper").attr("rel",page_id);
	 var content="";
	 var pg_content = set_pg_content(page_id);

	 	$("#main_content").html(pg_content);

	 if(page_id==null){
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

	if(currentslide == 5){
	document.getElementById("click_through").innerHTML='<div class="blocker"></div><div class="home" onclick="checkBtns(2)"></div>';
		}
	if(currentslide == 7){
	document.getElementById("click_through").innerHTML='<div class="blocker"></div><div class="home" onclick="checkBtns(4)"></div>';
		}
	if(currentslide == 8){
	document.getElementById("click_through").innerHTML='<div class="blocker"></div><div class="home" onclick="checkBtns(4)"></div>';
		}
    if(currentslide == 9){
	document.getElementById("click_through").innerHTML='<div class="blocker"></div><div class="home" onclick="checkBtns(4)"></div>';
		}
	if(currentslide == 11){
	document.getElementById("click_through").innerHTML='<div class="blocker"></div><div class="home" onclick="checkBtns(6)"></div>';
		}

	}

	function checkBtns(refNum){
		switch(refNum){
			case 1:
			open_page('',5);
            break;
			case 2:
			open_page('',4);
            break;
			case 3:
			open_page('',9);
            break;
			case 4:
			open_page('',6);
            break;
			case 5:
			open_page('',11);
            break;
			case 6:
			open_page('',10);
            break;
			case 7:
			open_page('',3);
            break;
			case 8:
			open_page('',7);
            break;
			case 9:
			open_page('',8);
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


/*--------------------- animation javascript -----------------------*/

function hit_pop1() {
	$('.hit_1').css("display","block");
	$('.hit_close1').css("display","block");
	$('.hit_pop1').css("display","none");
}

function hit_pop2() {
	$('.hit_2').css("display","block");
	$('.hit_close1').css("display","block");
	$('.hit_pop2').css("display","none");
}

function hit_pop3() {
	$('.hit_3').css("display","block");
	$('.hit_close1').css("display","block");
	$('.hit_pop3').css("display","none");
}

function hit_pop4() {
	$('.hit_4').css("display","block");
	$('.hit_close1').css("display","block");
	$('.hit_pop4').css("display","none");
}

function hit_close1() {
	$('.hit_1').css("display","none");
	$('.hit_2').css("display","none");
	$('.hit_3').css("display","none");
	$('.hit_4').css("display","none");
	$('.hit_close1').css("display","none");
	$('.hit_pop1').css("display","block");
	$('.hit_pop2').css("display","block");
	$('.hit_pop3').css("display","block");
	$('.hit_pop4').css("display","block");
}


function kol() {
	$('.s3_vid').css("display","block");
	$('#s3_vid').css("display","block");
	$('.closekol').css("display","block");
	document.getElementById("s3_vid").play();
}

function closekol() {
	$('.s3_vid').css("display","none");
	$('#s3_vid').css("display","none");
	$('.closekol').css("display","none");
	var vid = document.getElementById("s3_vid");
	vid.pause();
	vid.currentTime = 0;
}


function spin1() {
	$('.spin1').css("display","none");
	$('.s2_1').css("display","none");
	$('.s2_2').css("display","none");
	$('.s2_3').css("display","none");
	$('.spin2').css("display","block");
	$('.s2_4').css("display","block");
	$('.s2_5').css("display","block");
	$('.s2_6').css("display","block");
}

function spin2() {
	$('.spin2').css("display","none");
	$('.s2_4').css("display","none");
	$('.s2_5').css("display","none");
	$('.s2_6').css("display","none");
	$('.spin3').css("display","block");
	$('.s2_7').css("display","block");
	$('.s2_8').css("display","block");
	$('.s2_9').css("display","block");
}

function spin3() {
	$('.spin3').css("display","none");
	$('.s2_7').css("display","none");
	$('.s2_8').css("display","none");
	$('.s2_9').css("display","none");
	$('.spin1').css("display","block");
	$('.s2_1').css("display","block");
	$('.s2_2').css("display","block");
	$('.s2_3').css("display","block");
}