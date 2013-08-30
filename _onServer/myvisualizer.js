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
		if(i%intVal==0){
			lastTotal=0;
		}
		arrYPosition[i]=lastTotal+$currArray[i];
		lastTotal=arrYPosition[i];

	};

	
	$svg.selectAll('rect').transition().duration(1500).delay(function(d,i){
		return i*30
	})
	.attr('y',function(d,i){
		return $y(arrYPosition[i]/intVal);
	})
	.attr('height',function(d,i){
		return $height(d/intVal)
	})
	.attr('x',function(d,i){
		return $x(i-i%intVal)-rectWidth($currArray);
	})
	.attr('width',function(d,i){
		return rectWidth($currArray)*intVal;
	})

	;

	$svg.selectAll('.value').transition().duration(1500)
		.style('fill-opacity',0).remove();
	$svg.selectAll('.tag').transition().duration(1500)
		.style('fill-opacity',0).remove();
	if(intVal==1){
				//加入tag的字
		$D3currArray.append('text').text(function(d,i){return i})
			.attr('x',function(d,i){
				return $x(i)-(1.5)*rectWidth($currArray);
			})
			.attr('y',function(d,i){
				return height-padding+em;
			})
			.attr('class','tag')
			.style('fill-opacity',0)
			.transition().duration(1500)
			.style('fill-opacity',1);

					//加入value的字
		$D3currArray.append('text')
			
			.attr('transform',function(d,i){
				str="";
				str+='translate(';
				str+=($x(i));
				str+=',';
				str+=($y(d))-em;
				str+=')';
				str+='rotate(-90)';
				return str;
			})
			.attr('class','value')
			.text(function(d,i){
				return (Math.floor(d*1000)/1000)
			})
			.style('fill-opacity',0)
			.transition().duration(1500)
			.style('fill-opacity',1);


	}else{

		for (var i = 0; i < arrYPosition.length/intVal; i++) {
			$svg.append('text').attr('class','value')
				.text((i*intVal+1)+'到'+(i+1)*intVal+"點")
				.attr('x',$x(i*intVal)-(3)*rectWidth($currArray))
				.attr('y',height-padding+em)
				.style('fill-opacity',0)
				.transition().duration(1500)
				.style('fill-opacity',1);

			$svg.append('text').attr('class','value')
					.attr('transform',function(d,i2){
					str="";
					str+='translate(';
					str+=($x(i*intVal));
					str+=',';
					str+=$y(arrYPosition[((i+1)*intVal)-1]/intVal)-em;
					str+=')';
					str+='rotate(-90)';
					return str;
				})
				.attr('class','value')
				.text(Math.floor((arrYPosition[((i+1)*intVal)-1]*1000)/1000))
				.style('fill-opacity',0)
				.transition().duration(1500)
				.style('fill-opacity',1);
		};
	};


}

//排序
showsortit=function(bVal){
	if(bVal){
		sortArray=$currArray.concat().sort(function(a,b){return b-a});
		var orderArray=[];
		for (var i = 0; i < sortArray.length; i++) {
			orderArray[i]=sortArray.indexOf($currArray[i]);
		};
	}else{
		orderArray=d3.range($currArray.length);
	}

		$svg.selectAll('rect').transition().duration(1500).delay(function(d,i){
			return i*30
		})
		.attr('x',function(d,i){
			return $x(orderArray[i])-rectWidth($currArray);
		});

		$svg.selectAll('.tag').transition().duration(1500).delay(function(d,i){
			return i*30
		})
		.attr('x',function(d,i){
			return $x(orderArray[i])-(1.5)*rectWidth($currArray);
		});

		$svg.selectAll('.value').transition().duration(1500).delay(function(d,i){
			return i*30
		})
		.attr('transform',function(d,i){
			str="";
			str+='translate(';
			str+=($x(orderArray[i]));
			str+=',';
			str+=($y(d))-em;
			str+=')';
			str+='rotate(-90)';
			return str;
		});
	


};

visualize=function(jsonData,dataType){

	$jsonData=jsonData;
	type1=dataType.split('.')[0];
	typeDura=dataType.split('.')[1];

	//取得cmet/cmeo的比例
	//horw代入"h"或"w"可取得hour 或weekday的值
	arrCmetOverCmeo=function(horw){
		arrCmet=arrFromObj($jsonData["cmet."+horw]);
		arrCmeo=arrFromObj($jsonData["cmeo."+horw]);
		arr=new Array();
		for (var i = 0; i < arrCmet.length; i++) {
			arr.push(arrCmet[i]/arrCmeo[i]);
		};

		return arr;
	}

	arrFromCSA=function(csaKey,horw){
		arrCSA=arrFromObj($jsonData['ccb.'+horw]);
		arrReturn=[];
		for (var i = 0; i < arrCSA.length; i++) {
			arrReturn.push(arrCSA[i][csaKey]);
		};
		return arrReturn;

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
		if(type1=='cmeto'){
			$currArray=arrCmetOverCmeo(typeDura);
		}else if(type1.substr(0,3)=='ccb'){
			csaKey=type1.split('->')[1];
			$currArray=arrFromCSA(csaKey,typeDura);
		}else{
			$currArray=arrFromObj($jsonData[dataType]);
		}


		$x=d3.scale.ordinal()
			.domain(d3.range($currArray.length))
			.rangePoints([padding,width-padding]);
		$y=d3.scale.linear()
			.domain([0,arrMax()])
			.range([height-padding,padding]);
		$height=d3.scale.linear()
			.domain([0,arrMax()])
			.range([0,height-2*padding]);

		$D3currArray=$g1.data($currArray).enter();

		$D3currArray.append('rect')
			.attr('x',function(d,i){
				return $x(i)-rectWidth($currArray);
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
				return $y(d);
			})
			.attr('height',function(d,i){
				return $height(d)
			})
			.attr('fill','blue');

		//加入tag的字
		$D3currArray.append('text').text(function(d,i){return i})
			.attr('x',function(d,i){
				return $x(i)-(1.5)*rectWidth($currArray);
			})
			.attr('y',function(d,i){
				return height-padding+em;
			})
			.attr('class','tag')
			.style('fill-opacity',1);

		//加入value的字
		$D3currArray.append('text')
			.attr('transform',function(d,i){
				str="";
				str+='translate(';
				str+=($x(i));
				str+=',';
				str+=($y(0))-em;
				str+=')';
				str+='rotate(-90)';
				return str;
			})
			.transition().duration(1500)
			.attr('transform',function(d,i){
				str="";
				str+='translate(';
				str+=($x(i));
				str+=',';
				str+=($y(d))-em;
				str+=')';
				str+='rotate(-90)';
				return str;
			})
			.attr('class','value')
			.text(function(d,i){
				return (Math.floor(d*1000)/1000)
			})
			.style('fill-opacity',1);


	};

	main();

};

