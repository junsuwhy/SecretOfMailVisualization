var $D3currArray=null;
var $svg=null;
var $g1=null;
var $jsonData=null;
var $currArray=null;

var $x;
var $y;

//換區間
showTimeRange=function(intVal){
	arrYPosition=[];
	for (var i = 0; i < $currArray.length; i++) {
		if(i%intVal==0)lastTotal=0;
		arrYPosition[i]=lastTotal+$currArray[i];
		lastTotal=arrYPosition[i];
	};

	
	$svg.selectAll('rect').transition().duration(1500).delay(function(d,i){
		return i*30
	})
	.attr('y',function(d,i){
		return height-padding-$y(arrYPosition[i]/intVal);
	})
	.attr('height',function(d,i){
		return $y(d/intVal)
	})
	.attr('x',function(d,i){
		return padding+$x(i-i%intVal)-rectWidth($currArray);
	})
	.attr('width',function(d,i){
		return (width-2*padding)/($currArray.length/intVal)-rectWidth($currArray)
	})

	;



}

//排序
showsortit=function(bVal){
	if(bVal){
		sortArray=$currArray.concat().sort(function(a,b){return b-a});
		var orderArray=[];
		for (var i = 0; i < sortArray.length; i++) {
			orderArray[i]=sortArray.indexOf($currArray[i]);
		};

		$svg.selectAll('rect').transition().duration(1500).delay(function(d,i){
			return i*30
		})
		.attr('x',function(d,i){
			return padding+$x(orderArray[i])-rectWidth($currArray);
		});

		$svg.selectAll('.tag').transition().duration(1500).delay(function(d,i){
			return i*30
		})
		.attr('x',function(d,i){
			return padding+$x(orderArray[i])-(1.5)*rectWidth($currArray);
		});

		$svg.selectAll('.value').transition().duration(1500).delay(function(d,i){
			return i*30
		})
		.attr('transform',function(d,i){
			str="";
			str+='translate(';
			str+=(padding+$x(orderArray[i]));
			str+=',';
			str+=(height-padding-d*ylength/arrMax($currArray))-em;
			str+=')';
			str+='rotate(-90)';
			return str;
		});
	}
	else{
		sortArray=$currArray.concat().sort(function(a,b){return b-a});
		var orderArray=[];
		for (var i = 0; i < sortArray.length; i++) {
			orderArray[i]=sortArray.indexOf($currArray[i]);
		};
		$svg.selectAll('rect').transition().duration(1500).delay(function(d,i){
			return i*30
		})
		.attr('x',function(d,i){
			return padding+$x(i)-rectWidth($currArray);
		});
		$svg.selectAll('.tag').transition().duration(1500).delay(function(d,i){
			return i*30
		})
		.attr('x',function(d,i){
			return padding+$x(i)-(1.5)*rectWidth($currArray);
		});
		$svg.selectAll('.value').transition().duration(1500).delay(function(d,i){
			return i*30
		})
		.attr('transform',function(d,i){
			str="";
			str+='translate(';
			str+=(padding+$x(i));
			str+=',';
			str+=(height-padding-$y(d))-em;
			str+=')';
			str+='rotate(-90)';
			return str;
		});
	}
	


};

visualize=function(jsonData,dataType){

	console.log(jsonData);
	$jsonData=jsonData;

	//取得cmet/cmeo的比例
	//horw代入"h"或"w"可取得hour 或weekday的值
	arrCmetOverCmeo=function(horw){
		arrCmet=arrFromObj($jsonData["cmet."+horw]);
		arrCmeo=arrFromObj($jsonData["cmeo."+horw])
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
		max=$currArray[0]
		for (var i = 0; i < $currArray.length; i++) {
			if($currArray[i]>max)max=$currArray[i];
		};
		return max;
	}


	main=function(){

		//初使化
		$("#svg-container").empty();
		$("#svg-container").append('<svg>');
		$svg=d3.select('#svg-container svg');
		$svg.attr('width',width).attr('height',height);
		$g1=$svg.append("g").attr('id','group1').selectAll('#group1');

		//指定要代入的資料矩陣是什麼
		$currArray=arrFromObj($jsonData[dataType]);
		//$currArray=arrCmetOverCmeo("h");
		//console.log($currArray);


		$x=d3.scale.ordinal().domain(d3.range($currArray.length)).rangePoints([0,width-2*padding]);
		$y=d3.scale.linear().domain([0,arrMax()]).range([0,height-2*padding]);

		$D3currArray=$g1.data($currArray).enter();

		$D3currArray.append('rect')
			.attr('x',function(d,i){
				return padding+$x(i)-rectWidth($currArray);
			})
			.attr('y',function(d,i){
				return height-padding;
			})
			.attr('width',function(d,i){
				return rectWidth($currArray)
			})
			.attr("height",0)
			.transition()
			.duration(1500)
			.attr('y',function(d,i){
				return height-padding-$y(d);
			})
			.attr('height',function(d,i){
				return $y(d)
			})
			.attr('fill','blue');

		//加入tag的字
		$D3currArray.append('text').text(function(d,i){return i})
			.attr('x',function(d,i){
				return padding+$x(i)-(1.5)*rectWidth($currArray);
			})
			.attr('y',function(d,i){
				return height-padding+em;
			})
			.attr('class','tag');

		//加入value的字
		$D3currArray.append('text')
			//.attr('x',function(d,i){
			//	return padding+i*xlength/$currArray.length-2*5;
			//})
			//.attr('y',function(d,i){
			//	return height-padding-d*ylength/arrMax($currArray);
			//})
			.attr('transform',function(d,i){
				str="";
				str+='translate(';
				str+=(padding+$x(i));
				str+=',';
				str+=(height-padding-$y(d))-em;
				str+=')';
				str+='rotate(-90)';
				return str;
			})
			.attr('class','value')
			.text(function(d,i){return d});


	};

	main();

};

