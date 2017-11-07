/*

广州精攻网络科技有限公司 版权所有
高薪诚聘html5高手！
联系QQ：30997860,1040702373,103334417

*/

/**
 * uploader的方法介绍,使用的JS为upload.js
 * @module JG_API
 */

/**
   * <b>uploader</b>介绍
   * <br> 
   * @constructor
   * @class uploader 
   * @example
   *
   *     var bar;
   *
   */
var oss_Url="http://oss.kxtui.cn/";
var image_oss="http://image.kxtui.com/";
var uploader=function(a){
	     /**
	      *  
	      * @property picidcm
	      * @description 标记是所属的IDCM，使用相应方法的时候需要设置
	      * @default -4表示图片未使用
	      * @type {Number}
	      * @example
	      * uploader.picidcm=1;
	      */
	     this.picidcm=-4;//未使用图片的标记
	     /**
	      *  
	      * @property picidfl
	      * @description 标记是所属的idfl记录
	      * @default -1
	      * @type {Number}
	      * @example
	      * uploader.picidfl=1;
	      */
		 this.picidfl=-1;//是不是在游戏记录当中使用
		 /**
	      *  
	      * @property piciddhm
	      * @description 标记是所属的奖品记录
	      * @default -1
	      * @type {Number}
	      * @example
	      * uploader.picidfl=1;
	      */
		 this.piciddhm=-1;//是不是在领奖当中使用
		 this.jcrop_api=null;
		 this.boundx=null;
		 this.boundy;
		 this.addurl="";
		 this.spesltyp=0;//特殊用途，暂时用于分辨图标上传
		 this.filesList=null;
		 this.fliesAttr={};
		 this.reader=null;
		 this.routeNo=0;//当前翻转角度
		 this.curImgIndex = 0;//当前编辑的图片
		 this.curImgId = 0;//当前选中图片id
		 this.hideupxx = 0;//是否隐藏图片分类层
		  /**
	      *  
	      * @property tagcmid
	      * @description 点击图片选中的目标CM
	      * @default 0
	      * @type {Number}
	      * @example
	      * uploader.tagcmid=1;
	      */
		 this.tagcmid=0;//点击图片选中的目标CM
		 /**
	      *  
	      * @property tagcmid
	      * @description 点击图片选中的目标CM
	      * @default 0
	      * @type {Number}
	      * @example
	      * uploader.tagcmcsx=0;
	      */
		 this.tagcmcsx=0;//点击图片选中的目标的顺序
		  /**
	      *  
	      * @property tagcmidpg
	      * @description 点击图片选中的目标CMIDPG
	      * @default 0
	      * @type {Number}
	      * @example
	      * uploader.tagcmidpg=0;
	      */
		 this.tagcmidpg=0;//点击图片选中的目标CMIDPG
		  /**
	      *  
	      * @property targetdiv
	      * @description 点击图片选中的目标div需替换的位置
	      * @default ""
	      * @type {string}
	      * @example
	      * uploader.tagcmidpg=0;
	      */
		 this.targetdiv="";//点击图片选中的目标div需替换的位置
		 this.imgInfoList=[];//需要读取图片信息的ID
		  /**
	      *  
	      * @property func
	      * @description 选择图片后的回调函数
	      * @default Null
	      * @type {function}
	      * @example
	      * uploader.tagcmidpg=0;
	      */
		 this.func;
		 this.ctag="";
		 this.fiListOp=-1;//上传完成的回调显示图片
		 this.outseleimgs;//重新绑定外部事件，用于调用选择图片后，点击选中事件,返回JSON  {idfl:id,path:path}
		 this.caninsert=0;//首次进入图片选择时，不需要insert图片
		 //重新初始化对像
		 this.init=function(){
		    uploader.jcrop_api=null;
		    uploader.boundx=null;
		    uploader.boundy;
		    uploader.addurl="";
		    uploader.filesList=null;
			uploader.reader=null;
		 };
	 
		 /*创建DIV*/
		 /**
		  * @method bulidup 
		  * @description 创建上传控件,用这种方法创建将会自动的识别使用微信还是HTTP上传
		  * @param  {[type]} tagdiv 目标div的ID
		  * @return {[type]}        [description]
		  */
		 this.buildup=function(tagdiv,func){
			var str="";  
				str+='<div  class="uploader clearfix" style="width:100%;background:#eee;border:0;padding-left:0;padding-right:0;">';
				str+='<div id="dropTa" >'+(navig.weixin?'如无法选择，请按右上-在浏览器打开':'将图片拖动到这里,或者:')+'</div>';
 				if(j().getv("app","")=="android" || j().getv("app","")=="ios"){
	             	str+='<div class="clearfix browser" style="width:'+(navig.weixin?350:160)+'px" onclick="takePhoto()">';
	 				str+='  <label class=fleft style="width:150px;margin:0">';
	               	str+=' <span style="font-size:20px;line-height:120%;">App选择图片</span>';
	               	//str+='<input type="file" name="files[]" id="file1" accept="image\/\*" multiple="multiple">';  capture="camera" 会影响multiple
	             	str+=' </label>';
	            }else{
	            	str+='<div class="clearfix browser" style="width:'+(navig.weixin?350:160)+'px">';
	 				str+='  <label class=fleft style="width:150px;margin:0">';
	               	str+=' <span style="font-size:20px;line-height:120%;">选择图片</span>';
	               	str+='<input type="file" name="files[]" id="file1" accept="image\/\*"  multiple="multiple">';//  capture="camera" 会影响multiple
	             	str+=' </label>';
	            }
				if(navig.weixin){
					str+='<div  id="jgdataload" style="position:fixed;top:0px;left:0px; width:100%; height:100%;  background-image:url(/css/opa0.png);z-index:99999;display:none;">	<div style="width:46px;height:46px;background-image: url(/css/ajax-loader.gif);margin: 0 auto;margin-top: 320px;"></div></div><label  class=fleft style="width:150px;margin:0 0 0 45px">';
					str+=' <span style="font-size:20px;line-height:120%;">拍照或选图</span>';
					str+='<input type="button"  id="file2"  onclick="uploader.wxupload();" />'; 
					str+=' </label>';
				}
           	str+=' </div>';
			
			/*添加上传后的图片选择窗口*/
			str+='<div class="col-md-6" style="display:none;margin-top:10px">';
           str+='<div class="panel panel-default">';
             str+='<div class="panel-body demo-panel-files" id="uploadList">';
            str+='<span class="demo-note">尚未选择图片</span>';
            str+='</div>';
            str+='</div>';
            str+='</div>';
			
          	
			
		     /*添加编辑，显示框 `垂直翻转|uploader.imgReverse('w')|`水平翻转|uploader.imgReverse('h')|*/
            j().ui({ cid: "picedit2",w:68,s:4,  z: "-1", ncheck: "-2", ca: "放大|uploader.imgToSize(50)|`缩小|uploader.imgToSize(-50)|`右旋|uploader.route(30)|`左旋|uploader.route(-30)|`取消|uploader.cancelEdit()|", class0: "x_c_blue2 _r_5 _f_16 cent" });
			str+=' <div id="imgeditor" style=" display:none;clear:both">';
            str += '<div style="width:370px;height:40px">' + j().geta(ui.ui.all["picedit2"]) + '</div>';
            str+='<div id="imageidcha" style="overflow: hidden;"> </div>';
            str += '</div>';
			
			str+='</div>'; 
			j("#"+tagdiv).html(str);
		 
		 /*添加监听事件*/
		     if(j(".simditor-body").length>0){
				 //与富文本同时使用时，会造成事件冲突
				 j("#dropTa").html("");
				 j(".image-popover").css({"z-index":'99999'});
			 }else{
				 j("#dropTa").on('drop', function (evt){
					 evt.preventDefault();
					 uploader.filesList = evt.originalEvent.dataTransfer.files; 
					 uploader.createFileDiv(0);
				 });
				 j(document).on("dragenter", function(f) {
						f.stopPropagation();
						f.preventDefault();
				});
				j(document).on("dragover", function(f) {
					f.stopPropagation();
					f.preventDefault();
				});
				j(document).on("drop", function(f) {
					f.stopPropagation();
					f.preventDefault();
				});
			 }
			 j('#file1').on('change',function(){ 
			     //旧方法
				uploader.filesList = j('#file1')[0].files;
				uploader.createFileDiv(0);
				  
			 });
			 if(navig.weixin){
				 wx_ready(1,func);
			 }else{
				 if (typeof (func) != "undefined") {
					db.dofunc(func, {});
				}
			 }
			//}
		 };
		 /*选择图片后，显示上传列表*/
		 this.createFileDiv=function(i){
			 var str='';
			 j('.col-md-6').show();
			 if(!uploader.reader)uploader.reader=new FileReader();
			 if(i==0)j("#uploadList").html('');  
			 if(i>=uploader.filesList.length)return; 
				uploader.reader.readAsDataURL(uploader.filesList[i]);
				uploader.reader.onload = function (e) {
				   
				    str = '<div id="preup-file_' + i + '" style="height:90px"> <div id="preview-container_' + i + '" class="preview-container"  style="width: 88px;height: 88px;overflow: hidden; float: left;" ><img style="width: 88px;height: 88px;" id="preup-img_' + i + '" src="' + e.target.result + '" class="jcrop-preview"></div><div style="float: left;"  >' + ((uploader.filesList[i].name.length < 12) ? uploader.filesList[i].name : (uploader.filesList[i].name.substring(0, 12) + '..'+uploader.filesList[i].name.split('.')[1])) + ' (' + Math.floor(uploader.filesList[i].size*0.001) + ' kB) <span id="updateState_' + i + '">未上传</span></div><div class="progress fleft progress-striped active" style="width:200px;margin-left:10px;background: #ddd;"><div class="progress-bar fleft" role="progressbar" id="progressbar_' + i + '" style="width: 0%;background:#008696"><span id="sr-only_' + i + '" style="font-size:12px"  class="sr-only"></span></div> </div> <div class=fleft>' + j().ui({ cid: "picedit1",  w: "70",s:5,z: "-2", ncheck: "-2", marg: 5, ca: "删除|uploader.delfFileDiv(" + i + ")|`编辑|uploader.showImage(" + i + ")|`上传|uploader.startUpload("+i+")|", class0: "x_c_blue2 _f_18 _r_5 cent" }) + '</div> </div>';
					j("#uploadList").append(str);  
					uploader.createFileDiv(i+1);
				} 
			
	     };
		 this.cancelEdit=function(){
			  if(!uploader.reader)uploader.reader=new FileReader();
			     uploader.reader.readAsDataURL(uploader.filesList[uploader.curImgIndex]);
			     uploader.reader.onload = function(e){
			        j("preup-img_"+uploader.curImgIndex).src=e.target.result;
			     };
			    j("#imgeditor").hide();
			    uploader.initFliesAttr(uploader.curImgIndex);//初始化属性值  
		 };
		 /*删除文件事件*/
		 this.delfFileDiv=function(findex){
		    j("#preup-file_"+findex).remove(); 
		 };
		 /*编辑图片事件,op是否需要重新初化化更改属性数据*/
		 this.showImage=function(findex,op,w,h){
			 if(!op){
				uploader.initFliesAttr(findex);//初始化属性值 
				j("#imgeditor").show();
			 }
			   uploader.curImgIndex=findex;
			   var styleStr="width:380px;";
		       if(w)styleStr=' width:'+w+'px;height:'+h+'px;';
				try{
					j("#imageidcha").html('<img src="" id="preup-img"  style="'+styleStr+'" />');
					jcrop_api.destroy(); 
				}catch(ex){}
				var oImage = document.getElementById('preup-img'); 
				
				uploader.reader.readAsDataURL(uploader.filesList[findex]);
				uploader.reader.onload = function(e){
					
					// e.target.result contains the DataURL which we can use as a source of the image
					oImage.src = e.target.result; 
					oImage.onload = function () { 	
					   	uploader.fliesAttr[findex].w=j(oImage).width();
						uploader.fliesAttr[findex].h=j(oImage).height(); 
						
						// destroy Jcrop if it is existed
						if (uploader.jcrop_api) 
							uploader.jcrop_api.destroy(); 
						// initialize Jcrop
						j('#preup-img').Jcrop({
							minSize: [32, 32], // min crop size
							//aspectRatio : 1, // keep aspect ratio 1:1
							bgFade: true, // use fade effect
							bgOpacity: .3, // fade opacity
							onChange: uploader.updatePreview,
							onSelect: uploader.updatePreview,
							//onRelease:uploader.clearInfo
						}, function(){
							var bounds = this.getBounds();
							uploader.boundx = bounds[0];
							uploader.boundy = bounds[1]; 
							uploader.jcrop_api = this;
						});
						j(j('.jcrop-tracker')[1]).html(j(oImage).width()+'*'+j(oImage).height());
					};
				};  		 
	   };
	   this.initFliesAttr=function(findex){
		   uploader.fliesAttr[findex]={
			   x:0,
			   y:0,
			   x1:0,
			   y1:0,
			   w:0,//截取宽度
			   h:0,//截取高度
			   sr:0,//原图选转角度
 			   srh:0,//y轴旋转
			   srw:0//x轴旋转
			    			   
		   };
		   
	   }; 
	   
	   //修改图片时显示缩略图
	   this.updatePreview=function(c){ 
	        uploader.fliesAttr[uploader.curImgIndex].x=c.x;
			uploader.fliesAttr[uploader.curImgIndex].y=c.y; 
			uploader.fliesAttr[uploader.curImgIndex].x1=c.x2;
			uploader.fliesAttr[uploader.curImgIndex].y1=c.y2; 
			uploader.fliesAttr[uploader.curImgIndex].w=c.w;
			uploader.fliesAttr[uploader.curImgIndex].h=c.h; 
			j(j('.jcrop-tracker')[0]).html(c.w+'*'+c.h);
			
			 if (parseInt(c.w) > 0)
			 {
				var xsize=j("#preview-container_"+uploader.curImgIndex).width();
				var ysize=j("#preview-container_"+uploader.curImgIndex).height();
				var rx = xsize / c.w;
				var ry = ysize / c.h;
		
				j("#preup-img_"+uploader.curImgIndex).css({
				  width: Math.round(rx * uploader.boundx) + 'px',
				  height: Math.round(ry * uploader.boundy) + 'px',
				  marginLeft: '-' + Math.round(rx * c.x) + 'px',
				  marginTop: '-' + Math.round(ry * c.y) + 'px'
				});
			  }
	   };
	   //	//放大、缩小
	this.imgToSize=function(size){
	   var img = j("#preup-img");
	   var w1=img.width() + size;
	   var h1=img.height() + size/img.width()*img.height();
        uploader.showImage(uploader.curImgIndex,1,w1,h1);
	
	};
	//翻转
	this.route=function(no) {
		  uploader.routeNo+=no;
		  uploader.fliesAttr[uploader.curImgIndex].sr=uploader.routeNo;
		var arr = [];
    	j('#imageidcha').find('img').each(function(i){arr.push(this);});
    	j("img[id^='preup-img_"+uploader.curImgIndex+"']").each(function(i){arr.push(this);});
		 j(arr).each(function(){
 				  j(this).stopRotate();
				  j(this).rotate({
						duration: 1000, 
						animateTo:uploader.routeNo
				  });    
			  
		  });
	     ;  
    };
	//转置
	this.imgReverse=function(arg) { 
		var arr = [];
    	j('#imageidcha').find('img').each(function(i){arr.push(this);});
    	j("img[id^='preup-img_"+uploader.curImgIndex+"']").each(function(i){arr.push(this);});
		j(arr).each(function(){
 			   var img = j(this);
			  if (arg == 'h'){
				if(img.attr('filter')=='fliph'){
					img.css( {'filter' : '','-moz-transform': '','-webkit-transform': ''} );
					}else{
						img.attr('filter','fliph');
						 img.css( {'filter' : 'fliph','-moz-transform': 'matrix(-1, 0, 0, 1, 0, 0)','-webkit-transform': 'matrix(-1, 0, 0, 1, 0, 0)'} );
					}
			  }else{
				  	if(img.attr('filter')=='flipv'){
						img.css( {'filter' : '','-moz-transform': '','-webkit-transform': ''} );
					}else{
						img.attr('filter','flipv');
						img.css( {'filter' : 'flipv','-moz-transform': 'matrix(1, 0, 0, -1, 0, 0)','-webkit-transform': 'matrix(1, 0, 0, -1, 0, 0)'} );
						 
					}
			  }   
			 
		  }); 
		   
    };
	//上传前操作
	this.onBeforeUpload=function(findex){
		j("#imgeditor").hide();
		j("#updateState_"+findex).html("正在上传");
	};
	//上传进度
	this.onUploadProgress=function(findex,l){
		j("#progressbar_"+findex).width(l+'%');
		j("#sr-only_"+findex).html(l); 
	};
	//上传完成
	this.onUploadSuccess=function(findex){
	   	j("#updateState_"+findex).html("上传成功"); 	
	};
	this.onUploadError=function(findex,o){
		j("#updateState_"+findex).html("上传错误:"+o); 	
	};
	this.onUploadComplete=function(findex){
	   j("#updateState_"+findex).html("上传已完成"); 	
	   uploader.showFiList(uploader.fiListOp);
	   j("#progressbar_"+findex).parent().remove();
	   j("#bnt1_"+findex+",#bnt2_"+findex).remove();
	   if(uploader.spesltyp==-2){
	   	  setTimeout(function(){
			  j().jalert("图标上传成功，<span style='color:red;'>请再次点击图标按钮进行更换</span>。",null,{clas:"ui3b"});
		  },1000);
	   }
	};
	//上传MP3
	this.uploadAudio=function(json){
		var inputid=json.inputid||'file1';
		var ifprogress=json.ifprogress||1;//是否显示进度条，默认显示，-1不显示
		var prodivid=json.prodivid||"prodiv";//进度条id
		var proclas=json.proclas||"proclas";//进度条样式
		if(ifprogress>0){
			j("#"+prodivid).html('<div id="prodivs" class="'+proclas+'" style="width:0%;height:100%;"></div>');
		}
		var f = new FormData();
		f.append(j('#'+inputid)[0].files[0].name, j('#'+inputid)[0].files[0]);
		var url1='http:\/\/'+window.domain+"/saveimg.jsp?ifret=2&idpg=-4&ctag=-1&csx=-5&idcm="+idcm+"&idus="+db.idus;
			j.ajax({
			  url:url1 ,   
			  type:"POST",
			  dataType:"html",
			  data:f,
			  cache: false,
			  contentType: false,
			  processData: false,
			  forceSync: false,
			  xhr: function() {
					var i = j.ajaxSettings.xhr();
					if (i.upload) {
						i.upload.addEventListener("progress", function(m) {
							var l = 0;
							var n = m.loaded || m.position;
							var k = m.total || e.totalSize;
							if (m.lengthComputable) {
								l = Math.ceil(n / k * 100);
							} 
							j("#prodivs").css({"width":l+"%"}); 
						}, false)
					}
					return i;
				},
				success: function(rs, i, k) { 
					if (typeof (json.func) != "undefined") {
						db.dofunc(json.func, {});
					}else{
						j("#ppid_cmc").val(rs.split("\/tomcat")[1]);
						j().jalert("成功上传",null,{clas:"ui3b",ifms:-2});
					}
				},
				error: function(k, i, rs) { 
				},
				complete: function(i, rs) { 
				}
			});   
	};
	//执行上传事件
	/**
	 * @method startUpload
	 * @description 执行上传事件，上传视频将自动使用阿里OSS上传
	 * @param  {[type]} findex  文件索引，从0开始，默认值0,如果是多图上传，需要重复调用
	 * @param  {[type]} addurl  POST到保存文件的附加链接
	 * @param  {[type]} func    回调函数，将保存后的文件ID返回，
	 * @param  {[type]} inputid input file控件的ID，默认值是'file1'
	 * @return {[type]}         [description]
	 * @example
	 * uploader.startUpload(0,'',function(i,json){ alert(JSON.stringify(json)) })；
	 */
	this.startUpload=function(findex,addurl,func,inputid,onfunc){
		//将文件加入的Data当中
		findex=findex||0;
		inputid=inputid||'file1';
		
	   addurl=addurl||"";
	   var oImage=document.getElementById('preup-img');
	   if(uploader.fliesAttr[findex]){
		   j.each(uploader.fliesAttr[findex],function(k,n){
			   addurl+="&"+k+"="+n;
		   }); 
		    
 	   }
	   if(addurl==""){//如果没有截取宽高，则取原始宽高
	   		nw=document.getElementById('preup-img_'+findex).naturalWidth;
			nh=document.getElementById('preup-img_'+findex).naturalHeight;
	   		if(nw>800){//强制压缩
				var sbili=800/nw;
				nw=800;
				nh=(sbili*nh).toFixed(0);
 			}
		  addurl="&w="+nw;   
		   addurl+="&h="+nh;   
	   }
	   if(addurl.indexOf("&x=")==-1)addurl+="&x=0";
	   uploader.filesList = j('#'+inputid)[0].files;
	   addurl+="&sh="+j(oImage).height()+"&sw="+j(oImage).width();	 
	   uploader.onBeforeUpload(findex); 
	   uploader.filesList = j('#'+inputid)[0].files;
	   var fext=uploader.filesList[findex].name.split('.')[1].toLowerCase();
	   var videoExtArr=["rm","rmvb","mov","mpeg","mov","mp4"];
	  // if(j.inArray(fext,videoExtArr)>-1||addurl.indexOf("&up=aloss")>-1||lurl.indexOf("&up=aloss")>-1||lurl.indexOf("csse")>-1){
         
	  // }
	   
	    if(galx==8 && aibao.cmtyp==1){
			uploader.tagcmcsx = aibao.cmtyp;
		}
		
	  
		
       
 		//点击了【上传】之后才能insert图片
 		uploader.caninsert=1;
		
	   uploader.UploadToalOss({findex:findex,addUrl:addurl,func:func,onUploadComplete:onfunc}); 
	   return;
	  /* 
	  
	    var f = new FormData();
		 f.append(uploader.filesList[findex].name, uploader.filesList[findex]);
	  j.ajax({
		  url:'http:\/\/'+window.domain+"/saveimg.jsp?idpg=-4&ctag="+uploader.ctag+"&idfl="+uploader.picidfl+"&iddhm="+uploader.piciddhm+"&csx="+uploader.tagcmcsx+"&idcm="+uploader.picidcm+"&idus="+ db.idus+addurl,   
		  type:"POST",
		  dataType:"html",
		  data:f,
		  cache: false,
		  contentType: false,
		  processData: false,
		  forceSync: false,
		  xhr: function() { 
		        var i = j.ajaxSettings.xhr();
                if (i.upload) {
                    i.upload.addEventListener("progress", function(m) {
                        var l = 0;
                        var n = m.loaded || m.position;
                        var k = m.total || e.totalSize;
                        if (m.lengthComputable) {
                            l = Math.ceil(n / k * 100);
                        }
                        uploader.onUploadProgress(findex,l);
                    }, false)
                }
                return i
            },
			success: function(rs, i, k) {
               uploader.onUploadSuccess(findex);
            },
			error: function(k, i, rs) {
                uploader.onUploadError(findex,rs);
            },
			complete: function(i, rs) {
               
			   if(func){db.dofunc(func,i.responseText);
			   }else{
			   	uploader.onUploadComplete(findex);
			   }
            }
		}); */
	 
	};
	/*OSS签名JSON*/
	this.OssSingleJson={};
	/*获得OSS签名,成功后的回调*/
	this.getOssSingle=function(func){ 
		//先请求签名
		db.jp("/alioss.jsp?ifSavefi=0",function(i,jsonaa){
			uploader.OssSingleJson=jsonaa;
			db.dofunc(func,jsonaa);
		});
	}; 
	/**
	 * @method singleUpOssNoSaveFi
	 * @description 执行单文件上传，不需要保存到FI,必须先调用getOssSingle，具体使用可以参照gameManage 
	 * @param  {[type]} findex  文件索引，从0开始，默认值0,如果是多图上传，需要重复调用
	 * @param  {[type]} savefname  保存的文件名，包括路径及文件名及后缀 
	 * @param  {[type]} func  上传成功后回去调,{findex:findex,fn:clienName}
	 * @return {[type]}         [description]
	 * @example 
	 */
	this.singleUpOssNoSaveFi=function(findex,savefname,func,json){
	   var jsonaa=uploader.OssSingleJson;
	   var f = new FormData();
	   f.append("OSSAccessKeyId",jsonaa.OSSAccessKeyId);
	   f.append("policy",jsonaa.policy);
	   f.append("signature",jsonaa.Signature); 
	   f.append("key",savefname); 
	   f.append("file", uploader.filesList[findex]); 
	   j.ajax({
		  url:jsonaa.host,  
		  data:f,
		  cache: false,
		  contentType: false,
		  processData: false,
		  forceSync: false,
		  type:"POST",
		  xhr: function() { 
				var i = j.ajaxSettings.xhr();
				if (i.upload) {
					i.upload.addEventListener("progress", function(m) {
						var l = 0;
						var n = m.loaded || m.position;
						var k = m.total || e.totalSize;
						if (m.lengthComputable) {
							l = Math.ceil(n / k * 100);
						}
						if(typeof (json.onUploadProgress) != "undefined"){
							 db.dofunc(json.onUploadProgress,{findex:findex,fin:l});
						}else{
							uploader.onUploadProgress(findex,l);
						}
					}, false)
				}
				return i
			},
			success: function(rs, i, k) {
				var clienName=oss_Url+savefname;
				if(clienName.indexOf("jpg")>-1||clienName.indexOf("png")>-1||clienName.indexOf("gif")>-1){
					clienName=image_oss+savefname;
				}
				db.dofunc(func,{findex:findex,fn:clienName}); 
			},
			error: function(k, i, rs) {
				if(typeof (json.onUploadError) != "undefined"){
				   db.dofunc(json.onUploadError,{findex:findex,Msg:i.responseText});
				}else{
					uploader.onUploadError(findex,rs);
				}
			},
			complete: function(i, rs) {
			   
			   if(typeof (json.onUploadComplete) != "undefined"){
				   db.dofunc(json.onUploadComplete,{findex:findex,Msg:i.responseText});
			   }else{
				   uploader.onUploadComplete(findex);
			   }
			}
		}); 
		
		
	};
	
	
	//阿里OSS上传，执行上传事件（目前暂时传为视频等大文件上传使用）<br>通过此方法上传的内容，需要通过oss_Url+原有文件进行访问,EG:vadoiSrc=oss_Url+"pg/fi/" + (jn.created+'').substring(0, 5) + '/'+jn.created+'.'+jn.cext; 
	/**
	 * @method UploadToalOss
	 * @description 执行上传事件，建议在视频中使用
	 * @param  {[type]} json  文件索引，从0开始，默认值0,如果是多图上传，需要重复调用
	 * @param  {[type]} json.findex  文件索引，从0开始，默认值0,如果是多图上传，需要重复调用
	 * @param  {[type]} json.inputid  input file控件的ID，默认值是'file1'
	 * @param  {[type]} json.ctag  存放文件的标签分类，默认调用 uploader.ctag;
	 * @param  {[type]} json.idfl  FI表的对应IDFL字段，默认调用uploader.picidfl
	 * @param  {[type]} json.piciddhm FI表的对应IDDHM字段，默认调用uploader.piciddhm
	 * @param  {[type]} json.tagcmcsx 存放文件的顺序字段，默认调用 uploader.tagcmcsx;
	 * @param  {[type]} json.picidcm  FI表的对应IDCM字段，默认调用uploader.picidcm
	 * @param  {[type]} json.onUploadProgress  文件上传进度回调的方法（使用自定义回调返回JSON格式数据，当前上传文件顺序，及当前进度{findex:0,fin:l}），<br>默认使用uploader.onUploadProgress(findex,l);
	 * @param  {[type]} json.onUploadSuccess  文件上传成功后的回调方法（使用自定义回调返回JSON格式数据，当前上传文件顺序，文件名{findex:0,fn:"pg/fi/a.jpg"}）此处直接返回的是阿里上的文件路径，请直接使用赋值，<br>默认使用uploader.onUploadSuccess(findex,l);
	 * @param  {[type]} json.onUploadError  文件上传出错的回调方法（使用自定义回调返回JSON格式数据，当前上传文件顺序，错误信息{findex:0,msg:"XXX"}）此处直接返回的是阿里上的文件路径，请直接使用赋值，<br>默认使用uploader.onUploadError(findex,rs);
	 * @param  {[type]} json.onUploadComplete  文件上传完成的回调方法（使用自定义回调返回JSON格式数据，当前上传文件顺序，信息{findex:0,msg:"XXX"}）此处直接返回的是阿里上的文件路径，请直接使用赋值，<br>默认使用uploader.onUploadComplete(findex,responseText);
	 * @param  {[type]} json.addurl  POST到保存文件的附加链接  
	 * @return {[type]}         [description]
	 * @example
	 * uploader.startUpload(0,'',function(i,json){ alert(JSON.stringify(json)) })；
	 */
	this.UploadToalOss=function(json){
		var json=json||{};
		
		//将文件加入的Data当中
		var findex=json.findex||0;
		var inputid=json.inputid||'file1';
		var ctag=json.ctag||uploader.ctag;
		var idfl=json.idfl||uploader.picidfl;
		var piciddhm=json.piciddhm||uploader.piciddhm;
		var tagcmcsx=json.tagcmcsx||uploader.tagcmcsx;
		var picidcm=json.picidcm||uploader.picidcm;
		var addUrl=json.addUrl||""; 
		
		var f = new FormData();
		if(!uploader.filesList)uploader.filesList = j('#'+inputid)[0].files;  
		//先请求签名
		db.jp("/alioss.jsp?idpg=-4&ctag="+ctag+"&idfl="+idfl+"&iddhm="+piciddhm+"&csx=-1&fullName="+uploader.filesList[findex].name+"&idcm="+picidcm+"&idus="+ db.idus+addUrl,
		      function(i,jsonaa){
			       f.append("OSSAccessKeyId",jsonaa.OSSAccessKeyId);
				   f.append("policy",jsonaa.policy);
				   f.append("signature",jsonaa.Signature); 
				   f.append("key",jsonaa.savefname); 
				   f.append("file", uploader.filesList[findex]); 
				   j.ajax({
					  url:jsonaa.host,  
					  data:f,
					  cache: false,
					  contentType: false,
					  processData: false,
					  forceSync: false,
					  type:"POST",
					  xhr: function() { 
							var i = j.ajaxSettings.xhr();
							if (i.upload) {
								i.upload.addEventListener("progress", function(m) {
									var l = 0;
									var n = m.loaded || m.position;
									var k = m.total || e.totalSize;
									if (m.lengthComputable) {
										l = Math.ceil(n / k * 100);
									}
									if(typeof (json.onUploadProgress) != "undefined"){
									   	 db.dofunc(json.onUploadProgress,{findex:findex,fin:l});
									}else{
										uploader.onUploadProgress(findex,l);
								    }
								}, false)
							}
							return i
						},
						success: function(rs, i, k) {
							var clienName=oss_Url+jsonaa.savefname;
							if(clienName.indexOf("jpg")>-1||clienName.indexOf("png")>-1||clienName.indexOf("gif")>-1){
								clienName=image_oss+jsonaa.savefname;
							}
							if(typeof (json.onUploadSuccess) != "undefined"){
						   	   db.dofunc(json.onUploadSuccess,{findex:findex,fn:clienName,ifoss:1,created:jsonaa.created,idfi:jsonaa.sid});
							}else if(typeof (json.func) != "undefined"){
							   db.dofunc(json.func,{findex:findex,fn:clienName,ifoss:1,created:jsonaa.created,idfi:jsonaa.sid});
							}else{
						       uploader.onUploadSuccess(findex,clienName);
						    }
						},
						error: function(k, i, rs) {
							if(typeof (json.onUploadError) != "undefined"){
						   	   db.dofunc(json.onUploadError,{findex:findex,Msg:i.responseText});
							}else{
								uploader.onUploadError(findex,rs);
							}
						},
						complete: function(i, rs) {
						   
						   if(typeof (json.onUploadComplete) != "undefined"){
						   	   db.dofunc(json.onUploadComplete,{findex:findex,Msg:i.responseText});
						   }else{
							   uploader.onUploadComplete(findex);
						   }
						}
					}); 
		});
	 
	};
	this.showset=function(op){
	   if(op==0){
		  j("#ctrlbtn").hide();
		  uploader.showFiList(-1);
	   }else if(op==1){
		  j("#ctrlbtn").show();
	   }	
		
		
	};
	/**
	 * @method bulid
	 * @description 创建图片列表
	 * @param  {[type]} divid  存放生成的DIV的ID
	 * @param  {[type]} func   选择后的回调函数
	 * @param  {[type]} unused 是否显示未使用图片
	 * @return {[type]}        [description]
	 */
	this.bulid= function (divid,func,unused,op) {
		uploader.spesltyp=op||0;//-2图标
		uploader.caninsert = 0;//点击【图片】按钮准备上传图片时，禁止错误地insert图片
		var s = j().ui({ cid: "pictab", s: 0,padd:3,marg:0, w: 98,h:27, ncheck: "1", ca: "所有图库|uploader.showFiList(2)|`相关图库|uploader.showFiList(3)|`我的图库|uploader.showFiList(1)`我的标记|uploader.showFiList(4)", class0: "x_c_blue2 cent _f_18 " });
		var str='<div class="clearfix" style="clear:both;padding-top:15px;"><div style="width:410px;height:40px;'+((galx==8 || uploader.hideupxx==1)?"display:none;":"")+'">' + j().ui({ cid: "upxx",w:-25,padd:0,h:38,s:0,marg:0, class1:'', class0: "_f_22 cent _r_5p5p0p0p x_c_blue3", ca: "未使用|uploader.showset(0)|`更多|uploader.showset(1)|" }) + '</div><form method="post" action="#" enctype="multipart/form-data"><div id="uploaddiv" style="clear:both;"></div></form><div id="ctrlbtn" style="display:none;width:420px;">'+s+'</div></div>';
		var s2=(galx==8?"":j().ui({ cid: "btnd",s:5,w:70, ncheck: 1,marg:5,padd:2, ca: "上一页|uploader.showfils(-1)|`下一页|uploader.showfils(1)|",   class0: "x_c_blue2 cent _f_18" }));
		if(j("#"+divid).html().indexOf('form')>-1){//如果有则直接赋值
			if(galx!=8)j(j("#"+divid).children()[0]).html(s);
			j("#showpicsmenu").html(s2);
		}else{//如果没有则生成
	       j("#"+divid).html(str+'<div id="showpicsdiv" style="clear:both;width:98%;'+(op==-2?"display:none;":"")+'"></div><div id="showpicsmenu" style="clear:both;display:table">'+s2+'</div>');
		}
		uploader.buildup('uploaddiv',function(){uploader.showFiList(-1)});
		uploader.func=func;
		
		/*if(unused){//只显示未使用的图片
		    j("div[id^='pictab']").hide();
			uploader.fiListOp=-1;
		    uploader.showFiList(-1);
		}else{
		   uploader.showFiList(1);
		   j("#upxx_0,#pictab_2").checkd();
		}*/ 
		//uploader.showFiList(-1);
		j("#upxx_0").checkd();
		j("#pictab_2").checkd();
		 
		
		
	};
	this.showfils=function(cpn){
		uploader.showFiList(j('#showpicsmenu').attr('op'),parseInt(j('#showpicsmenu').attr('cpn'))+cpn);
	};	
	//获得fi列表,op1,表示我的。2表示所有
	this.showFiList=function(op,cpn){
		var cpn=cpn||0;
		 j('#showpicsmenu').attr('op',op);
		 j('#showpicsmenu').attr('cpn',cpn);
		 var strt = '';
		 var strWhere=' 1=1 ';//j('#uploaddiv').hide();j('#uploaddiv').show();j('#uploaddiv').show();
		 if(op==1){strWhere=' idus=' + db.idus;}
		 if(op==-1){
		 	strWhere=' idus=' + db.idus+" and idcm=-4";
			if(galx==8){
				if(uploader.picidcm==-5 || aibao.cmtyp==1){
					strWhere=' idus=' + db.idus+" and idcm=-5";
				}
			}else{
				if(uploader.picidcm==-5){
					strWhere=' idus=' + db.idus+" and idcm=-5";
				}
			}
		 }//+uploader.picidcm未使用的图片
		 if (op == 3) strWhere = ' idpg=' + idpg;
		 if (op == 4) strWhere = ' idus=' + db.idus + ' and ctag!="" and ctag!="-1"';
		 if(galx==8 && aibao.cmtyp==1){
			 strWhere += " and csx='1'";
		 }
		 if(galx==8 && aibao.cmtyp==18){
			 strWhere += " and csx='18'";
		 }
		 //if(galx==8)alert(strWhere);
		 db.sajax('fi', 'all', strWhere + ' and galx='+galx+' order by modifyd desc limit '+(0+cpn*20)+',20', '', function (i, json) { 
			 //if(galx==8)alert("in0");
		      uploader.gshowpic(json, op);
			//if (strt == '')strt = '无任何图片信息！'; 
			//j('#showpicsdiv' ).html(strt); 
		//	uploader.getImgInfoList();
    	}, '&option=001');
		
	};
	this.getImgInfoList=function(){
	  // uploader.imgInfoList=[];
	   j('img[id^="my-img_"]').load(function(){ 
	   		if(this.naturalWidth!=88 || this.naturalHeight!=88)j(this).next().html(this.naturalWidth+"×"+this.naturalHeight);
	   }); 
	}; 
	this.delfi=function(obj){
		var id=obj;
		if(typeof(obj)=='object')id=j(obj).find('[id^="my-img_"]').attr('id').substring(7); 
	    db.sajax('fi', 'f1=-1', ' id=' + id, '', function (i, json) {
            j('#my-img_'+id).parent().remove();
			delete db.sj.fi.all[id];
		}, '&option=001');
	
	};
	//图片选中事件
	/**
	 * @method seleimgs
	 * @description 选择图片事件,注意需要与公共属性相结合,tagcmid,tagcmcsx,idpg,picidfl,piciddhm等根据实际情况相结合
	 * @param  {[type]} obj  图片的ID或者是图片对象
	 * @param  {[type]} cobj 执行动画的对象，被替换的图片对象
	 * @return {[type]}      [description]
	 */
	this.seleimgs=function(obj,cobj){
		var id=obj;
		if(typeof(obj)=='object')id=j(obj).find('[id^="my-img_"]').attr('id').substring(7);
		uploader.curImgId = id;
		var pathd='';
		//if(db.sj.fi.all[id])pathd='/pg/fi/' + (db.sj.fi.all[id].created + '').substring(0, 5) + '/' + db.sj.fi.all[id].created + '.'+db.sj.fi.all[id].cext;
		pathd=jg_getpngPath(db.sj.fi.all[id]);
		//'http:\/\/'+window.domain+
		if(typeof(uploader.outseleimgs)!='undefined'){
			db.dofunc(uploader.outseleimgs,{idfl:id,path:pathd});
		   return ;	
		}
		
		if(uploader.tagcmcsx==-3){
			if(cobj)j(cobj).removeClass("animated zoomOut").show().addClass("animated rotateIn"); 
			j().cls("ui3b");
			var tagUrl=pathd;
			if(tagUrl.indexOf("http")==-1)tagUrl="http:\/\/"+domain+pathd+"";
			db.jp("/dd.jsp?u="+tagUrl+"&spath=pg/cm/"+idcm+"/1.png",function(i,jsonaa){
				if(jsonaa.ret=='ok'){
					db.sajax("cm","idgr=idgr+1","id="+idcm,"",function(){
						j("#lpic1div").css({'background-image':"url(pg/cm/"+idcm+"/1.png?"+Math.random()+")"});
					});
				}
			});
			return;
		}
		if(uploader.tagcmcsx==-4){
			var tagUrl=pathd;
			if(tagUrl.indexOf("http")==-1)tagUrl="http:\/\/"+domain+pathd+"";
			if(cobj)j(cobj).removeClass("animated zoomOut").show().addClass("animated rotateIn");
			j().cls("ui3b");
			db.jp("/dd.jsp?u="+tagUrl+"&spath=pg/cm/"+idcm+"/2.png",function(i,jsonaa){
				if(jsonaa.ret=='ok'){
					db.sajax("cm","idgr=idgr+1","id="+idcm,"",function(){
						j("#lpic2div").css({'background-image':"url(pg/cm/"+idcm+"/2.png?"+Math.random()+")"});
					});
				}
			});
			return;
		}
		if(uploader.tagcmcsx==-6){
			var tagUrl=pathd;
			if(tagUrl.indexOf("http")==-1)tagUrl="http:\/\/"+domain+pathd+"";
			if(cobj)j(cobj).removeClass("animated zoomOut").show().addClass("animated rotateIn");
			j().cls("ui3b");
			db.jp("/dd.jsp?u="+tagUrl+"&spath=pg/cm/"+idcm+"/share_pic_bg.png",function(i,jsonaa){
				if(jsonaa.ret=='ok'){
					j().jalert("修改成功");
				}
			});
			return;
		}
		
		if(typeof(aibao)!="undefined"){
			if(galx==8 && aibao.cmtyp ==1){
				pathd='http:\/\/'+window.domain+'/pg/fi/' + (db.sj.fi.all[id].created + '').substring(0, 5) + '/' + db.sj.fi.all[id].created + '.'+db.sj.fi.all[id].cext+ '-2.'+db.sj.fi.all[id].cext;
				if(j().getv("app","")!=""){
					pathd=db.sj.fi.all[id].ctn;
				}
			}
		}
		//alert(j('.simditor-body').length);	
		if(j('.simditor-body').length>0){
			var cpaths='<img alt="'+db.sj.fi.all[id].ctn+'" style="max-width:98%" src="'+pathd+'" > ';
			//alert(cpaths);
			if(typeof(aibao)!="undefined")
				if(galx==8){
					//alert("in8");
					var bpicp='http:\/\/'+window.domain+'/pg/fi/' + (db.sj.fi.all[id].created + '').substring(0, 5) + '/' + db.sj.fi.all[id].created + '.'+db.sj.fi.all[id].cext;
					cpaths='<img alt="'+db.sj.fi.all[id].ctn+'" style="width:480px;" src="'+pathd+'" > ';
					if(aibao.cmtyp ==1){
						//cpaths='<img alt="Image" style="max-width:98%" src="'+pathd+'" onclick=aibao.imgshow(1)><div id="alpic" i="'+bpicp+'"></div>';
						//03.08修改为全屏弹出模式，并且调整图片大小，原因：发通知上传图片后查看大图路径不正确
						cpaths='<div onclick="jpn();"><img alt="'+db.sj.fi.all[id].ctn+'" style="width:98%;max-width: 300px;margin-left: 90px;" src="'+pathd+'" onclick=aibao.imgshow(2,1)></div><div id="alpic" i="'+(j().getv("app","")==""?bpicp:pathd)+'"></div>';
					}
				}
				//alert(cpaths);
			j('.simditor-body p:last').append(cpaths);
			 
		}
		
	   if(uploader.tagcmid>0){ 
	     var st="fi";
		 var sq='idcm='+uploader.tagcmid+",csx='"+uploader.tagcmcsx+"',idpg="+idpg+",idfl="+uploader.picidfl+",iddhm="+uploader.piciddhm;
		 var sw="";
		  
		if(db.sj.fi.all[id]&&(db.sj.fi.all[id].idcm>0||db.sj.fi.all[id].idus!=db.idus)){//且是被已经使用过的或者不是自己的,需新增记录 
		  st+='|fi';//回取数据
		  sq+=",galx="+galx+",ifoss="+db.sj.fi.all[id].ifoss+",w="+db.sj.fi.all[id].w+",w="+db.sj.fi.all[id].h+",ctn='"+db.sj.fi.all[id].ctn+"',idus="+db.idus+",created="+db.sj.fi.all[id].created+",cext='"+db.sj.fi.all[id].cext+"'|all";
		  sw="|id={idfi}";
		}else{
		   sw="id="+id	
		} 
		  
	     db.sajax(st, sq, sw, '', function (i, json) {
			 if(db.sj.fi.all[id]&&db.sj.fi.all[id].idcm>0){
			    db.sj.fi.all[id].idcm=uploader.tagcmid;
				db.sj.fi.all[id].csx=uploader.tagcmcsx;	 
				db.sj.fi.all[id].idfl=uploader.picidfl;
				db.sj.fi.all[id].iddhm=uploader.piciddhm;
			 }
			 if(uploader.targetdiv!=''){
				 setTimeout(function () {
				    j('#' +uploader.targetdiv).css('background', 'url(' + pathd + '?' + Math.random() + ') no-repeat center');
				 }, 1800);
			 }
			 if(cobj)j(cobj).removeClass("animated zoomOut").show().addClass("animated rotateIn"); 
			 db.dofunc( uploader.func);
			 
			 
		 }, '&option=001');
	   }else{
	      if(typeof(cmpl) != "undefined"){
	   			if(cmpl.iscmcm){
	   				if(j(cobj).parent().parent().ifcheck() == 0){
	   					j(cobj).parent().parent().checkd();
	   				}else{
	   					j(cobj).parent().parent().uncheckd();
	   				}
	   			}
	   		}else{
	        	j().jaler("选中目标不明确，选中事件失败"); 
	        }
	   }
	};
	/**
	 * @description 显示大图
	 * @method showimg
	 * @param  {[type]} obj 缩略图的DOM对象
	 * @return {[type]}     [description]
	 */
	this.showimg=function(obj,op){
		j().recss("x_c_green,_f_15__200,_r_2");
		var cobj=obj;
		if(op==1){
			cobj=j(obj).children("img")[0];
		}
		var picPath = "";
		var cpicIdcm = j().gv("db.sj.fi.all["+j(cobj).attr("id").split("_")[1]+"].idcm","0");
		if(op==2){
			picPath = j(cobj).css("background-image").split(")")[0].substring(4);
		}else{
			picPath = cobj.src.split('-s.')[0];
		}
		if(picPath.indexOf("@")>-1){
			picPath=picPath.split('@')[0];
		}

		 j().jalert('<div id=down class="clearfix" style="border-bottom: 1px solid;-webkit-border-bottom: 1px solid;'+(galx==8?"display:none;":"")+'"><span style="color:#fff;float: left;line-height: 2.4;font-size: 18px;margin: 0 7px;">图片资源</span><a href='+picPath+' class="x_c_green _f_15__200 cent _r_2" style="width:80px;height:30px;float:left;position:relative;margin:7px;cursor:pointer;" target="_blank">下载原图</a>'+((cpicIdcm>0 && db.role>8)?'<a href="/gcm.jsp?idcm='+cpicIdcm+'" class="x_c_green _f_15__200 cent _r_2" style="width:80px;height:30px;float:left;position:relative;margin:7px;cursor:pointer;" target="_blank">'+cpicIdcm+'</a>':'')+'</div><img  src=' + picPath + '  style="max-width: 420px;"><div style="clear:both"></div><div id=imglsdiv></div>',1,{clas:"emp",ifms:-2},null,j().getst()+114);
		 //j().getall({s:function(){}, pid:'imglsdiv', cid:{cid:'imglsdiv',w:90,z:-1, class0: "_f_22 _r_2__555 x_c_gray", class2: 'rightm _f_18'}, sjjson:{sqajax:''},tablename:'fi', st:'', sid:''}); 
	};
    //弹出保存fi标签编辑框
	this.showTagEdit = function (fiId) {
	    j().jaler('<div id="fitagDivtip" style="width: 400px;text-align: center;font-size: 16px;color: red;margin:10px;display:'+(db.idus == db.sj.fi.all[fiId].idus?'none':'block')+'">此图片不属于您，保存后将直接复制到您的图库</div><div id="fitagDiv" class="clearfix" style="margin-bottom:10px;">' + j().ui({ cid: 'fitagsel', w: 124, h: 35, s: 10, class0: '_r_2 x_c_gray _f_18', class1: 'x_check_radio leftm', cfun: 'jpn()', ca: 'LOGO||`背景图||`<bR>`自定义：' }) + '<input class="fleft" style="height:35px;width:110px;" id="diyTag" value="" type="text" /></div>' + '<div style="width:195px;">' + j().ui({ cid: 'savefitag', w: 94, h: 35, class0: '_r_5 x_c_blue2 _f_20', ca: '保存|uploader.saveFiTag(' + fiId + ')'+((db.sj.fi.all[fiId].idcm < 1 && db.idus == db.sj.fi.all[fiId].idus ||db.sj.fi.all[fiId].w==0||db.role>6) ? '`删除|uploader.delfi(' + fiId + ')' : '')  }) + '</div>');
	    
		if(db.sj.fi.all[fiId].ctag=="背景图"){
	      j("#fitagsel_1").checkd();	
		}else if(db.sj.fi.all[fiId].ctag!="LOGO"&&db.sj.fi.all[fiId].ctag!=""){
		   j("#fitagsel_2").checkd();
		}else{
		   j("#fitagsel_0").checkd();	
		}
	};
    //保存fi标签按钮事件
	this.saveFiTag = function (fiId) {
	    var selIndex = j("#fitagDiv").children("[class*='y_']").attr('id').substring(9);//获得选中项
	    var indexTxt = j("#fitagsel_" + selIndex + "_0").html();
	    
	    //如果是自定义
	    if (indexTxt == '自定义') {
	        indexTxt = j("#diyTag").val();
	        if (indexTxt == "") {
	            j().jaler('自定义标签不能为空！');
	            return;
	        }
	    }

	    var st = 'fi';
	    var sq = "ctag='" + indexTxt + "'";
	    var sw = "id=" + fiId;
		var stip="";
		if(db.sj.fi.all[fiId].idus!=db.idus){//不是自己的需新增记录 
			 st+='|fi';//回取数据
			sq+=",galx="+galx+",ctn='"+db.sj.fi.all[fiId].ctn+"',idus="+db.idus+",created="+db.sj.fi.all[fiId].created+",cext='"+db.sj.fi.all[fiId].cext+"'|all";
			sw="|id={idfi}";
			stip="图片资源已成功复制到您的图库，并";
		} 
	    db.sajax(st, sq, sw, '', function (i, json) {
	        j().jaler(stip+'成功保存标签！');
	    }, '&option=001');
	};
	this.gshowpic = function (json) {
	    //if(galx==8)alert("in");
		 j().getall(function(){ 
		     '<img  '+sclick+'=uploader.showimg(this) id="my-img_#id#" i="#id#" src="' + ('#cext#'.length>0?('#ifoss#'==1?(image_oss+'/pg/fi/' + ('#created#').substring(0, 5) + '/#created#.#cext#@1e_1c_0o_1l_150h_150w_90q'):'/pg/fi/' + ('#created#').substring(0, 5) + '/#created#.#cext#-s.#cext#'):'#ctn#') + '" class="jcrop-preview" style="width:150px;height:150px;"><div style="position:absolute;top:0px; background: #000;color: #fff;width:15px;word-break: break-all;" class="op50 ">#ctag#</div>' +  '<div style="margin-top: -31px; background: #000;color: #fff;'+(galx==8?"display:none;":"")+'" class="op50 cent" id="my-filemsg_#id#">#w#*#h#</div>' + j().ui({ cid: 'delimgbtn'+(galx==8?"_#id#":""),ncheck:2, w: 65, s: 0,marg:2, class0: 'x_c_blue2 _f_18 cent _r_1__eee', ca: '选中|uploader.seleimgs(#id#,this)|'+(galx==8?' h':'')+'`编辑|uploader.showTagEdit(#id#)|'+(galx==8?' h':'')+(galx==8?'`删除|uploader.delfi(#id#)':'')});
		     //+((db.idus=='#idus#')?j().ui({cid:'scimgbtn',w:44,s:0,class0:'rr5l nr x_gray bdc',class1:'x_check_radio leftm',ca:'收藏|uploader.sc(#id#,#sc#)|'}):'')

             //原按钮
		     //j().ui({ cid: 'delimgbtn', w: 44, s: 0, class0: '_c_blue cent _r_1__eee', ca: '选中|uploader.seleimgs(#id#)' + (('#idcm#' < 1 && db.idus == '#idus#') ? '`删除|uploader.delfi(#id#)' : '') })
			  
		},'showpicsdiv',{cid:'lsimg',w:150,z:-1, class0: "_f_22 _r_2__555 x_c_gray", class2: 'rightm _f_18'  },json,'fi','','');
		if(typeof(aibao)!='undefined')
			if(typeof(aibao.cmtyp)!='undefined'){
				//在六一城中，选中图片上传完成后自动选中（发通知，后台发风采）
				if(aibao.cmtyp==1 || aibao.cmtyp==4){
					setTimeout(function(){
						//如果不是app，则fi的id从上传完的数据中取
						if(j().getv("app","")=="")
							aibao.appPictureObj[0] = db.sj.fi.all[db.sj.fi.all.sx[db.sj.fi.all.sx.length-1]].id;
						//alert(aibao.appPictureObj[0]+"====="+uploader.caninsert);
						if(uploader.caninsert)uploader.seleimgs(aibao.appPictureObj[0],"#delimgbtn_"+aibao.appPictureObj[0]);
					},1000);
				}else{
					setTimeout(function(){j('div[id^="delimgbtn_"][i^="0"]').checkd();},1000);
				}
			}
	};
	/**
	 * @method bulidUpLoadInput
	 * @description 根据微信或者是其他浏览器，生成不同的input，调用不同的上传事件
	 * @param  {[type]} json [description]
	 * @param  {[type]} json.tagDiv 存在input的DIV的ID
	 * @param  {[type]} json.inpuDiv 生成的input控件名，默认"file1"
	 * @param  {[type]} json.btnStr 生成的input的中文名,默认，"选择图片"
	 * @param  {[type]} json.accept input上传的接收的文件形式,默认"image","video"
	 * @param  {[type]} json.func 回调参数，上传完成后的回调方法,{t:"+srs+",idfi:"+sid+",idus:"+idus+",cext:'"+fileExt+"'}
	 * @param  {[type]} json [description]
	 * @return {[type]}      [description]
	 */
	this.bulidUpLoadInput=function(json){
		var json=json||{};
		var tagDiv=json.tagDiv||"";
		var inpuDiv=json.inpuDiv||"file1";
		var btnStr=json.btnStr||"选择图片";
		var accept=json.accept||"image";//video;
		var ifAutoBind=json.ifAutoBind||1;
		var ismor=json.ismor||0;
		var func=json.func||function(){alert("scusee");};

		var html='<div class="uploader clearfix" style="width:100%;background:#eee;border:0;padding-left:0;padding-right:0;">';
		    html+='<div class="browser"><label><span style="font-size:20px;line-height:120%;">'+btnStr+'</span>';
            if(navig.weixin){
                html+='<input type="text"  id="'+inpuDiv+'" />';
            }else{
               html+='<form method="post" action="#" enctype="multipart/form-data"><input type="file" name="files[]"  id="'+inpuDiv+'" accept="'+accept+'\/*" '+(ismor==1?'multiple="multiple"':'')+'  /></form>';
            }
		    html+='</label></div></div>';
		if(tagDiv!=""){
			j("#"+tagDiv).html(html);
		}else{
			j().jalert(html,null,{clas:"ui3b"});
		}

		//绑定事件
		if(ifAutoBind==1){
			 if(navig.weixin){
				j("#"+inpuDiv).on("click",function(){
					uploader.wxupload({func:func});
				});
			 }else{
				j("#"+inpuDiv).on("change",function(){
					uploader.startUpload(0,"&ifret=3",func,inpuDiv);
				});
			 }
		} 
	};
	//扩展到微信的上传接口
	/**
	 * @description 使用微信同步上传方式,需要与picidfl，piciddhm，ctag，tagcmcsx，picidcm等根据实际情况相结合
	 * @method wxupload
	 * @param  {[type]} json [description]
	 * @param  {[type]} json.func 上传完成后回调函数
	 * @return {[type]}      [description]
	 * @example
	 *<br> uploader.tagcmcsx = -2;
	 *<br>uploader.picidcm = idcm;
	 *<br>uploader.wxupload({
	 *<br>	'func': function(a, b) {
	 *<br>		//匹配历史人物
	 *<br>		var rc = randomIndex = parseInt(Math.random()*4+1, 10);//parseInt(Math.random()*20+1, 10)
	 *<br>		j(".sc3jspic").css('background-image', 'url(' + jg_getpng(randomIndex*1+17) + ')');//'url(/' + jg_getpng(rc*1+17) + ')'
	 *<br>		var c = uploadpic = b.fn;
	 *<br>		var d = c.split('/')[3].split('.')[0];
	 *<br>		j(".sc3uppic").css('background-image', 'url(/' + c + ')').show();
	 *<br>	}
	 *<br>});
	 */
	this.wxupload=function(json){
		var json=json||{};
		
 		wx.chooseImage({
			success: function (res) {
				var localIds = res.localIds;  
				var imgi = 0, length22 = localIds.length; 
				 j("#jgdataload").show();
				 
				function upload(){ 
				  wx.uploadImage({
					localId: localIds[imgi], // 需要上传的图片的本地ID，由chooseImage接口获得
					isShowProgressTips:1,// 默认为1，显示进度提示
					success: function (res) { 
						//j().jalert('已上传到微信服务器。现在开始读取图片。');
						j().jalert('正在上传，请稍后',null,{clas:"ui3b"});
						imgi++; 
                        var serverId = res.serverId; // 返回图片的服务器端ID
						var fin=db.gett()+'';
						var url1="/weix.jsp?media_id="+serverId+"&appid="+scoAppid+"&idpg=-4&fin="+fin+"&idfl="+uploader.picidfl+"&iddhm="+uploader.piciddhm+"&ctag="+uploader.ctag+"&csx="+uploader.tagcmcsx+"&idcm="+uploader.picidcm+"&idus="+ db.idus+"&_="+Math.random();
						 
						setTimeout(function(){
							try{
							 
							  j.ajax({async:false,url : url1,dataType :'html',cache:false,　timeout:61000, 
							  success : function(jsonback){ 
								   if(jsonback.indexOf('updimgok')==-1){j("#jgdataload").hide();
									  //j().jalert('从微信服务器读取图片出错。'+JSON.stringify(jsonback));
									  j().jalert('上传失败，请重新上传。',null,{clas:"ui3b"});
									  return;
								   }
								   if (imgi < length22) {
									   upload();
								   }else{
									  j("#jgdataload").hide();
									  j().cls('ui3b');
									  
									  if(typeof(json.func)!="undefined"){
										  
										  db.dofunc(json.func,jsonback);
									  }else{
										  uploader.showFiList(uploader.fiListOp);
									  }
									}	 
							  }
								});
							}catch(ex){
								j().jalert(ex,null,{clas:"ui3b"});
								}
						},1000);
						 
						setTimeout(function(){
							if(j("#jhflower").attr('style').indexOf('38.png')>0){
							fn='pg/fi/'+fin.substring(0,5)+"/"+fin+'.jpg-s.jpg';
							j('#jhflower').html('..'+fn);
							if(ifsharein==1){
								j("#uppic2,#uppic4").css('background-image','url(/'+fn+')');
							}else{
								j("#uppic1").css('background-image','url(/'+fn+')');
							}
							j("#jhflower").css("background-image","url(/g/qrj/css/42.png)");
						 
							}
						},41000);
					},
					fail: function (res) {
					  alert(JSON.stringify(res));
					}
				}); 	
			 };
			 upload();
			}
		}); 
	 
		 
	};
	//微信异步上传，返回的路径需要从fi表里面去获取
	/**
	 * @description 使用微信异步上传方式，上传开始回调函数，上传过程由后台静默完成,需要与picidfl，piciddhm，ctag，tagcmcsx，picidcm等根据实际情况相结合
	 * @method wxupload2
	 * @param  {[type]} json [description]
	 * @param  {[type]} json.func 上传执行后回调函数,json的'fn'可以获得参数
	 * @return {[type]}      [description]
	 * @example
	 *<br> uploader.tagcmcsx = -2;
	 *<br> uploader.picidcm = idcm;
	 *<br> uploader.wxupload2({
	 *<br> 	'func': function(a, b) {
	 *<br> 		//匹配历史人物
	 *<br> 		var csexarr = mysex==0?(randomarr0):(randomarr1);
	 *<br> 		var rc = randomIndex = csexarr[parseInt(Math.random()*csexarr.length+0, 10)];//parseInt(Math.random()*20+1, 10)
	 *<br> 		xsdunum = parseInt(Math.random()*30+60, 10);
	 *<br> 		j("#xsdu").html(xsdunum);
	 *<br> 		j(".sc3jspic").css('background-image', 'url(' + jg_getpng(randomIndex*1+27) + ')');//'url(/' + jg_getpng(rc*1+17) + ')'
	 *<br> 		var c =uploadpic =b.fn;
	 *<br> 		refilename=b.reln;
	 *<br> 		j(".sc3uppic").css('background-image', 'url(' + c + ')').show();
	 *<br> 	}
	 *<br> });
	 * 
	 */
	this.wxupload2=function(json){
		wx.chooseImage({
			success: function (res) {
				var localIds = res.localIds;  
				var imgi = 0, length22 = localIds.length;  
				var tt=db.gett()+"";
				if(typeof(json.func)!="undefined"){
					db.dofunc(json.func,{'fn':localIds[0],'reln':tt});
			    }else{
				   uploader.showFiList(uploader.fiListOp);
			    }
				function upload(){ 
				  
				  wx.uploadImage({
					localId: localIds[imgi], // 需要上传的图片的本地ID，由chooseImage接口获得
					isShowProgressTips:0,// 默认为1，显示进度提示
					success: function (res) {  
                        var serverId = res.serverId; // 返回图片的服务器端ID 
						var url1="/weix.jsp?media_id="+serverId+"&idpg=-4&fin="+tt+"&ctag="+uploader.ctag+"&idfl="+uploader.picidfl+"&iddhm="+uploader.piciddhm+"&csx="+uploader.tagcmcsx+"&idcm="+uploader.picidcm+"&idus="+ db.idus+"&fin="+tt+"&_="+Math.random();
						 
						setTimeout(function(){
							try{
							 
							  j.ajax({async:true,url : url1,dataType :'html',cache:false,　timeout:61000, 
								  success : function(jsonback){ 
									if(lurl.indexOf('csse')>-1)alert(JSON.stringify(res));		 
								  }
								});
							}catch(ex){
							   
							}
						},1000); 
					},
					fail: function (res) {
					  if(lurl.indexOf('csse')>-1)alert(JSON.stringify(res));
					}
				}); 	
			 };
			 upload();
			}
		}); 
	};
	//64位图片上传，即在canvas中生成完成后的图片参数
	/**
	 * @method uploadBase64
	 * @description 64位图片上传，一般情况用于游戏记录中的事件
	 * @param  {[type]} json.dataStr 图片的数据"data:image/png" 
	 * @param  {[type]} json.picid 图片的ID建议使用fl的ID
	 * @param  {[type]} json.qm 图片存在的目录PG下的XX
	 * @param  {[type]} json.func 上传完成回调的函数 ，返回{'fn':a},A是服务器上的图片路径 
	 * @return {[type]}      [description]
	 */
	this.uploadBase64=function(json){
	   
	   var dataStr=json.dataStr||"";//64位图片字符串
	   var fext = fext || "jpg";//扩展名
	   var picid=json.picid||0;//图片名称ID，建议使用fl的ID
	   var qm=json.qm||"qm";//存放的目录PG/XX
	   
	   "data:image/png" == dataStr.substr(0, 14) ? (dataStr = dataStr.substr(22), fext = "png") : (dataStr = dataStr.substr(23), fext = "jpg");
	   
	   if(jQuery("#uploadBg64Tip").length>0){
		   jQuery("#uploadBg64Tip").show();
	   }else{
	      //生成提示界面
		  var str='<div id="uploadBg64Tip" style="display: block;background:rgba(0, 0, 0, .8);width:100%;height:100%;position:absolute;left:0;top:0;z-index:2000;display:none;"><p style="margin:0;padding:0;text-align:center;font-size:2.8125em;line-height:1.85em;color:#fff;position:absolute;top:8em;width:100%;">图片上传中(0)</p></div>';
		  jQuery('body').append(str);
	   }
	   //开始执行上传操作
	   var httpR = new XMLHttpRequest;
	  
		httpR.onreadystatechange = function() {
			//上传完成后
			if (4 == httpR.readyState && 200 == httpR.status) {
				var a = httpR.responseText;
				if(a.indexOf('pg')>-1){
					jQuery("#uploadBg64Tip").hide();
				   db.dofunc(json.func,{'fn':a});//直接返回数据 
				}else{
				   alert("上传出错了");
				   jQuery("#uploadBg64Tip").hide();
				}
			} else 4 == httpR.readyState && 200 !== httpR.status && (alert("code:" + httpR.status), jQuery("#uploadBg64Tip").hide());
		};
		httpR.ontimeout = function() {
			jQquery().jalert("上传超时，请在较好的网络环境中再试！",null,{clas:"ui3b"}); 
			jQuery("#uploadBg64Tip").hide();
		};
		httpR.upload && (httpR.upload.onprogress = function(dataStr) {
		   //dataStr.lengthComputable && jQuery("#uploadBg64Tip").html("<p>图片上传中<span>" + Math.round(dataStr.loaded / dataStr.total * 100) + '%)</span></p>');
		}); 
		var uploadUrl="/base64.jsp";
		//2016.1.4 17:00修改OSS方式上传BASE64
		if(db.gett()>1451899830000)uploadUrl='/ac/base64OSS.jsp';
		
		httpR.open("POST",uploadUrl,!0);
		httpR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		dataStr = "dataStr=" + encodeURIComponent(dataStr) + "&type=" + fext+"&id="+picid+"&t="+qm;
		jQuery("#uploadBg64Tip").html("<p>图片上传中</p>");
		httpR.send(dataStr);
	};
	/**
	 * @method getBase64Path
	 * @description 获得Base64的上传后的图片路径  
	 * @param  {[type]} json.picid 图片的ID建议使用fl的ID
	 * @param  {[type]} json.qm 图片存在的目录PG下的XX 
	 * @return {[type]}      [description]
	 */
	 
	this.getBase64Path=function(json){ 
	   var fext = fext || "jpg";//扩展名
	   var picid=json.picid||0;//图片名称ID，建议使用fl的ID
	   var qm=json.qm||"qm";//存放的目录PG/XX
	   
	   var strPath="pg/"+qm+"/"+picid+"."+fext;
	   if(db.gett()>1451899830000){
		  strPath=image_oss+strPath;
	   }else{
		   strPath="http:\/\/"+window.domain+"/"+strPath;	   
	   }
	   return strPath;
	};
	this.changeImageSizeObj;
	this.ifirse=false;
	/**
	 * @method coperImage
	 * @description 对图片对象进行缩放，大小，目前作用于富文本编辑器
	 * @param  {[type]} obj DOM对象，默认使用jQuery(".selected");
	 * @return {[type]}     [description]
	 */
	this.coperImage=function(obj){
	  var obj=obj||jQuery(".selected");
	  uploader.changeImageSizeObj=obj; 
	  uploader.ifirse=true;
	  if (uploader.jcrop_api)uploader.jcrop_api.destroy(); 
	  // initialize Jcrop
	  j(obj).Jcrop({
		minSize: [32, 32], // min crop size
		setSelect:[0,0,j(obj).width(),j(obj).height()],
		//aspectRatio : 1, // keep aspect ratio 1:1
		bgFade: true, // use fade effect
		bgOpacity: .3, // fade opacity
		allowSelect:false,
		allowMove:false,
		dragEdges:false,
		onChange: uploader.changeImageSize,
		onSelect: uploader.changeImageSizeFinish,
		dragEdges:2
		//onRelease:uploader.clearInfo
	  }, function(){
		var bounds = this.getBounds();
		uploader.boundx = bounds[0];
		uploader.boundy = bounds[1]; 
	 	uploader.jcrop_api = this;
	  });
	  j(j('.jcrop-tracker')[1]).html(j(obj).width()+'*'+j(obj).height());
	  j(".ord-w,.ord-nw,.ord-sw").hide();	
	  j(".jcrop-holder").css({"background-color":"rgba(255, 255, 255, 0)"});
	  j(".image-popover").css({"z-index":9999});
	  j(obj).blur(function() {
		 uploader.changeImageSizeFinish(); 
	  });
	
		
	};
	
	this.changeImageSize=function(c){
		j(j('.jcrop-tracker')[1]).html(c.w+'*'+c.h);
		j(uploader.changeImageSizeObj).css({"width":c.w+"px","height":c.h+"px"});
		j(".jcrop-holder").css({"width":(c.w+50)+"px","height":(c.h+50)+"px"});
		j(".jcrop-holder img").css({"width":c.w+"px","height":c.h+"px"});
		
	};
	/**
	 * @method changeImageSizeFinish
	 * @description 调整大小后，调用方法，用于释放
	 * @param  {[type]} op 是否需要根据width,heigth属性"width=800"，重置CSS样式当中的高度宽
	 * @return {[type]}   [description]
	 */
	this.changeImageSizeFinish=function(op){
		if(uploader.ifirse){
		  uploader.ifirse=false;	
		}else{
			j(uploader.changeImageSizeObj).css({"visibility":"visible"}).show();
			if(op)j(uploader.changeImageSizeObj).css({"width":jQuery(uploader.changeImageSizeObj).attr('width')+"px","height":jQuery(uploader.changeImageSizeObj).attr('height')+"px"});
			j(".jcrop-holder").remove();
			 
		}
	};
 };
var uploader = new uploader();
