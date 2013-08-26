console.log(jsonData);

//取得cmet/cmeo的比例
//horw代入"h"或"w"可取得hour 或weekday的值
arrCmetOverCmeo=function(horw){
	arrCmet=arrFromObj(jsonData["cmet."+horw]);
	arrCmeo=arrFromObj(jsonData["cmeo."+horw])
	arr=new Array();
	for (var i = 0; i < arrCmet.length; i++) {
		arr.push(arrCmet[i]/arrCmeo[i]);
	};

	return arr;
}

arrFromCSA=function(name1,csaKey){

}

//設定全域變數
width=800;
height=480;
padding=70;
filler="2:1";
arrFil=[];
arrFil[0]=parseInt(filler[0]);
arrFil[1]=parseInt(filler[2]);
em=16;

center={
	x:padding,
	y:height-padding
}
xlength=width-2*padding;
ylength=height-2*padding;

unitWidth=function(arr){return xlength/arr.length};
rectWidth=function(arr){return arrFil[1]*unitWidth(arr)/(arrFil[0]+arrFil[1])};
offsetWidth=function(arr){return arrFil[0]*unitWidth(arr)/(arrFil[0]+arrFil[1])};

	//取得最大值
	arrMax=function(){
		max=arr[0]
		for (var i = 0; i < arr.length; i++) {
			if(arr[i]>max)max=arr[i];
		};
		return max;
	}



$(document).ready(function(){

	main();

	
});


main=function(){

	//初使化
	$("#svg-container").append('<svg>');
	$svg=d3.select('#svg-container svg');
	$svg.attr('width',width).attr('height',height);
	$g1=$svg.append("g").attr('id','group1').selectAll('#group1');

	//指定要代入的資料矩陣是什麼
	arr=arrFromObj(jsonData['cmeo.h']);
	//arr=arrCmetOverCmeo("h");
	//console.log(arr);


	$g1data=$g1.data(arr).enter();

	$g1data.append('rect')
		.attr('x',function(d,i){
			return padding+i*unitWidth(arr)-rectWidth(arr);
		})
		.attr('y',function(d,i){
			return height-padding;
		})
		.attr('width',function(d,i){
			return rectWidth(arr)
		})
		.attr("height",0)
		.transition()
		.duration(3000)
		.attr('y',function(d,i){
			return height-padding-d*ylength/arrMax(arr);
		})
		.attr('height',function(d,i){
			return d*ylength/arrMax(arr)
		})
		.attr('fill','blue');

	//加入tag的字
	$g1data.append('text').text(function(d,i){return i})
		.attr('x',function(d,i){
			return padding+i*unitWidth(arr)-(1.5)*rectWidth(arr);
		})
		.attr('y',function(d,i){
			return height-padding+em;
		});

	//加入value的字
	$g1data.append('text').text(function(d,i){return d})
		//.attr('x',function(d,i){
		//	return padding+i*xlength/arr.length-2*5;
		//})
		//.attr('y',function(d,i){
		//	return height-padding-d*ylength/arrMax(arr);
		//})
		.attr('transform',function(d,i){
			str="";
			str+='translate(';
			str+=(padding+i*unitWidth(arr));
			str+=',';
			str+=(height-padding-d*ylength/arrMax(arr))-em;
			str+=')';
			str+='rotate(-90)';
			return str;
		});


};

$('#pressme').click(function(){
	//按下按鈕的動作
});