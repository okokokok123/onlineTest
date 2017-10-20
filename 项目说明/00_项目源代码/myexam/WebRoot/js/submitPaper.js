//用于剩余时间结束时显示对错，并统计分数和显示图片，并提交最后的答案
function checkPaper(){
	var info=""; //拼接的答案字符串
	var name=0;//用于判断多选题的复选框答案是否属于同一题
	var answers="";//存储jsp页面对应题的答案
	var reply="";  //存储用户回答的答案
	var scoreA=0;  //存储单选题对应分数
	var scoreB=0;  //存储多选题对应分数
	var scoreC=0;  //存储判断题对应分数
	var score=0;//统计分数
//单选框被选中并且 name 属性以A 结尾的输入框,单选题
	$("input[type='radio']:checked[name$='A']").each(function() {
		scoreA=$("#Ascore").val();
        info+=parseInt($(this).attr("name"))+":"+$(this).val()+",";
        answers=$("#"+parseInt($(this).attr("name"))+"answers").val();
        reply=$(this).val();
   
        	
      //判断对错，显示图片，统计分数
        if(answers!=reply){
        	$("#"+parseInt($(this).attr("name"))+"img").html("<img src='images/false.png'></br><label>得分:0</label>");
        }else{
        	$("#"+parseInt($(this).attr("name"))+"img").html("<img src='images/true.png'></br><label>得分:"+scoreA+"</label>");
        	score+=parseInt(scoreA);
        }
        
	});	
	
	
	//框被选中并且 name 属性以C 结尾的输入框,判断题
	$("input[type='radio']:checked[name$='C']").each(function() {
		scoreC=$("#Cscore").val();
        info+=parseInt($(this).attr("name"))+":"+$(this).val()+",";
        answers=$("#"+parseInt($(this).attr("name"))+"answers").val();
        reply=$(this).val();
      //判断对错，显示图片，统计分数
        if(answers!=reply){
        	$("#"+parseInt($(this).attr("name"))+"img").html("<img src='images/false.png'></br><label>得分:0</label>");
        }else{
        	$("#"+parseInt($(this).attr("name"))+"img").html("<img src='images/true.png'></br><label>得分:"+scoreC+"</label>");
        	score+=parseInt(scoreC);
        }
        
	});
	

	var Bname="";
	var count=0;
	var c=0;
	//多选题
	$("input[type='checkbox']:checked[name$='B']").each(function() {
        Bname=$(this).attr("name");
		c=$("input[type='checkbox']:checked[name='"+Bname+"']").length;//当前选中的属于同一题多选框的个数
		if(name!=parseInt($(this).attr("name"))){
			reply=$(this).val();
			name=parseInt($(this).attr("name"));
			count++;
		}else{
			reply+=$(this).val();
			count++;
		}
		
		if(count==c){//如6题用户答案是AB，数量为2，只有拼接两次才是完整答案，完整后与隐藏的正确答案判断对应答案
		scoreB=$("#Bscore").val();
		info+=parseInt($(this).attr("name"))+":"+reply+",";
		answers=$("#"+parseInt($(this).attr("name"))+"answers").val();
		//判断对错，显示图片，统计分数
		 if(answers!=reply){
	        	$("#"+parseInt($(this).attr("name"))+"img").html("<img src='images/false.png'></br><label>得分:0</label>");
	        }else{
	        	$("#"+parseInt($(this).attr("name"))+"img").html("<img src='images/true.png'></br></br><label>得分:"+scoreB+"</label>");
	        	score+=parseInt(scoreB);
	        }
		c=0;
		count=0;
		reply="";
		Bname="";
		}
	
		
	});	
    if(answer=="B"){
    	score=+3;
    	  System.out.println("答案正确");
    }
	//提交数据，显示总得分
	$("#totalScore").html("<h3>本次考试得分:"+score+"分<h3>");
	//alert(info);
	//alert($("#startTime").text());
	//通过正则将显示的html内容去除汉字，传到控制器在计算具体的时间
	var exatime=$("#startTime").text().replace(/[\u4e00-\u9fa5]/g," ");
	var surplustime=$("#surplusTime").text().replace(/[\u4e00-\u9fa5]/g," ");

	//alert(surplustime);
	$.post("Tpaper/addBackup",{"etime":exatime,
		"stime":surplustime,"result":score,"tpaper.tpaperid":$("form").attr("pid"),"answers":info},function(){
			});

}


//每隔5分钟刷新,以及点击提交时提交
function submitPaper(){
	
	var info=""; //拼接的答案字符串
	var name=0;//用于判断多选题的复选框答案是否属于同一题
	var reply="";  //存储用户回答的答案
	var score=0;//统计分数
//单选框被选中并且 name 属性以A 结尾的输入框,单选题
	$("input[type='radio']:checked[name$='A']").each(function() {
        info+=parseInt($(this).attr("name"))+":"+$(this).val()+",";
	});	
	
	
	//框被选中并且 name 属性以C 结尾的输入框,判断题
	$("input[type='radio']:checked[name$='C']").each(function() {
        info+=parseInt($(this).attr("name"))+":"+$(this).val()+",";
        
	});
	

	var Bname="";
	var count=0;
	var c=0;
	//多选题
	$("input[type='checkbox']:checked[name$='B']").each(function() {
        Bname=$(this).attr("name");//获取当前复选框name,当前四个选项的name是相同的 
		c=$("input[type='checkbox']:checked[name='"+Bname+"']").length;//当前选中的属于同一题多选框的个数
		if(name!=parseInt($(this).attr("name"))){//判断是否是同一题，name是题id
			reply=$(this).val();
			name=parseInt($(this).attr("name"));
			count++;
		}else{                              //若是同一题的答案，则进行拼接
			reply+=$(this).val();
			count++;
		}
		
		if(count==c){//如6题用户答案是AB，数量为2，只有拼接两次才是完整答案，完整后与隐藏的正确答案判断对应答案
		scoreB=$("#Bscore").val();
		info+=parseInt($(this).attr("name"))+":"+reply+",";
		c=0;
		count=0;
		reply="";
		Bname="";
		}
	
		
	});	
	
	//提交数据，显示总得分
	$("#totalScore").html("<h3>本次考试得分:"+score+"分<h3>");
	//alert(info);
	
	//alert($("#startTime").text());
	//对应开始和剩余时间，通过正则将显示的html内容去除汉字，传到控制器再计算具体的时间，这里显示的是0分钟12秒的内容
	var exatime=$("#startTime").text().replace(/[\u4e00-\u9fa5]/g," ");
	var surplustime=$("#surplusTime").text().replace(/[\u4e00-\u9fa5]/g," ");
	//alert(surplustime);
	$.post("Tpaper/addBackup",{"etime":exatime,
		"stime":surplustime,"tpaper.tpaperid":$("form").attr("pid"),"answers":info},function(){
			});
}





//用于自我检测显示答案和分数
function checkTest(){
	var info=""; //拼接的答案字符串
	var name=0;//用于判断多选题的复选框答案是否属于同一题
	var answers="";//存储jsp页面对应题的答案
	var reply="";  //存储用户回答的答案
	var scoreA=0;  //存储单选题对应分数
	var scoreB=0;  //存储多选题对应分数
	var scoreC=0;  //存储判断题对应分数
	var score=0;//统计分数
//单选框被选中并且 name 属性以A 结尾的输入框,单选题
	$("input[type='radio']:checked[name$='A']").each(function() {
		scoreA=$("#Ascore").val();
        answers=$("#"+parseInt($(this).attr("name"))+"answers").val();
        reply=$(this).val();
      //判断对错，显示图片，统计分数
        if(answers!=reply){
        	$("#"+parseInt($(this).attr("name"))+"img").html("<img src='${pageContext.request.contextPath}/images/false.png'></br><label>得分:0</label>");
        }else{
        	$("#"+parseInt($(this).attr("name"))+"img").html("<img src='${pageContext.request.contextPath}/images/true.png'></br><label>得分:"+scoreA+"</label>");
        	score+=parseInt(scoreA);
        }
        
	});	
	
	
	//框被选中并且 name 属性以C 结尾的输入框,判断题
	$("input[type='radio']:checked[name$='C']").each(function() {
		scoreC=$("#Cscore").val();
        answers=$("#"+parseInt($(this).attr("name"))+"answers").val();
        reply=$(this).val();
      //判断对错，显示图片，统计分数
        if(answers!=reply){
        	$("#"+parseInt($(this).attr("name"))+"img").html("<img src='${pageContext.request.contextPath}/images/false.png'></br><label>得分:0</label>");
        }else{
        	$("#"+parseInt($(this).attr("name"))+"img").html("<img src='${pageContext.request.contextPath}/images/true.png'></br><label>得分:"+scoreC+"</label>");
        	score+=parseInt(scoreC);
        }
        
	});
	

	var Bname="";
	var count=0;
	var c=0;
	//多选题
	$("input[type='checkbox']:checked[name$='B']").each(function() {
        Bname=$(this).attr("name");
		c=$("input[type='checkbox']:checked[name='"+Bname+"']").length;//当前选中的属于同一题多选框的个数
		if(name!=parseInt($(this).attr("name"))){
			reply=$(this).val();
			name=parseInt($(this).attr("name"));
			count++;
		}else{
			reply+=$(this).val();
			count++;
		}
		
		if(count==c){//如6题用户答案是AB，数量为2，只有拼接两次才是完整答案，完整后与隐藏的正确答案判断对应答案
		scoreB=$("#Bscore").val();
		answers=$("#"+parseInt($(this).attr("name"))+"answers").val();
		//判断对错，显示图片，统计分数
		 if(answers!=reply){
	        	$("#"+parseInt($(this).attr("name"))+"img").html("<img src='${pageContext.request.contextPath}/images/false.png'></br><label>得分:0</label>");
	        }else{
	        	$("#"+parseInt($(this).attr("name"))+"img").html("<img src='${pageContext.request.contextPath}/images/true.png'></br></br><label>得分:"+scoreB+"</label>");
	        	score+=parseInt(scoreB);
	        }
		c=0;
		count=0;
		reply="";
		Bname="";
		}
	
		
	});	
	
	//提交数据，显示总得分
	$("#totalScore").html("<h3>本次考试得分:"+score+"分<h3>");
	

}

       
