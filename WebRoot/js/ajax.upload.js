(function(window){
	function AjaxUpload(el, options){
		this.form = typeof el == "string" ? document.getElementById(el) : el;
		this.options = {
			contentType: "application/x-www-form-urlencoded",
			fileType: [],
			beforeUpload: function(){return true},
			success: function(data){},
			failure: function(){}
		};
		
		for(var key in options){
			this.options[key] = options[key];
		}
		
		if(this.options.contentType == "multipart/form-data"){
			var hasFormData = typeof FormData == "function" ? true : false;
			
			this._initFileTypeCheck();
			
			if(hasFormData){
				this.form.onsubmit = this._ajaxForm.bind(this);
			}else{
				this._iframeForm();
			}
		}else{
			var _this = this;
			this.form.onsubmit = function(){
				return _this._sendAjax.call(_this);
			}
			
		}
		
	}
	AjaxUpload.prototype = {
		constructor: AjaxUpload,
		_getXMLHttpRequest: function(){
			var xmlHttpRequest;
			try{
				// Firefox, Opera 8.0+, Safari
    			xmlHttpRequest=new XMLHttpRequest();
			}catch(e){
				try{
					// Internet Explorer
					xmlHttpRequest=new ActiveXObject("Msxml2.XMLHTTP");
				}catch(e){
					try{
						xmlHttpRequest=new ActiveXObject("Microsoft.XMLHTTP");
					}catch(e){
						throw new Error("你的浏览器过时了");
					}
				}
			}
			return xmlHttpRequest;
		},
		_initFileTypeCheck: function(){
			var _fileType = this.options.fileType;
			if(_fileType.length > 0){
				function checkType(){
					//if file onchange function be defined, execute it
					if(fileOnchange)
						fileOnchange();
					//matching the file type
					var reg = /\.[a-zA-z]+$/;
					var res = this.value.match(reg);
					if(res != null){
						var type = res[0].substring(1);
						var typeTrue = false;
						for(var i = 0; i < _fileType.length; i++){
							if(type.toLowerCase() == _fileType[i].toLowerCase()){
								typeTrue = true;
								break;
							}
						}
						if(!typeTrue){
							alert("file type must be " + _fileType);
							resetFile(this, checkType);
						}
					}else{
						alert("file type must be " + _fileType);
						resetFile(this, checkType);
					}
				}
				var fileOnchange;
				//get all of the form input field
				var eles = this.form.elements;
				for(var i = 0; i < eles.length; i++){
					var _input = eles[i];
					if(_input.type == "file"){
						fileOnchange = _input.onchange;
						_input.onchange = checkType;
					}
				}
			}
		},
		_sendAjax: function(){
			var xmlHttpRequest = this._getXMLHttpRequest();
			var _this = this;
			xmlHttpRequest.onreadystatechange = function(){
				if(xmlHttpRequest.readyState == 0){
					
				}else if(xmlHttpRequest.readyState == 1){  //before send
					
				}else if(xmlHttpRequest.readyState == 2){
					
				}else if(xmlHttpRequest.readyState == 3){
					
				}else if(xmlHttpRequest.readyState == 4){  //finish
					if(xmlHttpRequest.status == 200){
						_this.options.success(xmlHttpRequest.responseText);
					}else{
						_this.options.failure();
					}
				}
			};
			
			var method = this.form.method;
			var _url = this.form.action;
			var param = "";
			if(method == "post" && this.options.contentType == "application/json"){
				//serialize to json
				param = formSerialize(this.form, true);
			}else if(method == "post"){
				param = formSerialize(this.form);
			}
			if(method == "get"){
				param = formSerialize(this.form);
				_url = _url + "?" + param;
			}
			//open  asynchronous request
			xmlHttpRequest.open(method.toUpperCase(), _url, true);
			
			//if beforeUpload not retrun false, execute upload
			if(this.options.beforeUpload() == false){
			}else{
				//send
				if(method == "post"){
					xmlHttpRequest.setRequestHeader("Content-Type", this.options.contentType + "; charset=UTF-8");
					xmlHttpRequest.send(param);
				}else{
					xmlHttpRequest.send(null);
				}
			}
			
			//prevent form submit
			return false;
		},
		_ajaxForm: function(){
			var formData = new FormData(this.form);
			//get XMLHttpRequest object
			var xmlHttpRequest = this._getXMLHttpRequest();
			
			xmlHttpRequest.onreadystatechange = function(){
				if(xmlHttpRequest.readyState == 0){
					
				}else if(xmlHttpRequest.readyState == 1){  //before send
					
				}else if(xmlHttpRequest.readyState == 2){
					
				}else if(xmlHttpRequest.readyState == 3){
					
				}else if(xmlHttpRequest.readyState == 4){  //finish
					if(xmlHttpRequest.status == 200){
						this.options.success(xmlHttpRequest.responseText);
					}else{
						this.options.failure();
					}
				}
			}.bind(this);
			
			//open  asynchronous request
			xmlHttpRequest.open("POST", this.form.action, true);
			
			//if beforeUpload not retrun false, execute upload
			if(this.options.beforeUpload() == false){
			}else{
				//send formData
				xmlHttpRequest.send(formData);
			}
			
			//prevent form submit
			return false;
			
		},
		_iframeForm: function(){
			var iframe = document.createElement("iframe");
			iframe.name = "upload_iframe";
			iframe.src = "about:blank";
			iframe.style.display = "none";
			document.getElementsByTagName("body")[0].appendChild(iframe);
			var _options = this.options;
			
			//the iframe default load a blank page,it will call the load function
			//bind load callback function after 200s
			setTimeout(function(){
				iframe.onload = function(){
					var doc = iframe.contentDocument || iframe.document;
					if(doc.body.innerHTML){
						_options.success(doc.body.innerHTML);
					}else{
						_options.failure();
					}
				}
			}, 200);
			
			this.form.method = "post";
			this.form.enctype = this.options.contentType;
			this.form.target = iframe.name;
			this.form.onsubmit = this.options.beforeUpload;
		}
		
	}
	function resetFile(file, onchangeCallback){
		//when execute this.value = "", some browser will call onchange again
		file.onchange = null;
		//if not matching, reset the file
		file.value = "";
		//for IE11-
		if(file.value){
			var form = document.createElement('form'), ref = file.nextSibling, p = file.parentNode;  
            form.appendChild(file);  
            form.reset();  
            p.insertBefore(file,ref);
		}
		file.onchange = onchangeCallback;
	}
	function formSerialize(form, isJson){
		var elems = form.elements;
		var paramArray = new Array();
		var jsonStr = "{";
		for(var i = 0; i < elems.length; i++){
			var _input = elems[i];
			if(_input.type == "radio" || _input.type == "checkbox"){
				if(_input.checked){
					if(isJson){
						jsonStr += "\"" + _input.name + "\":\"" + _input.value + "\",";
					}else{
						paramArray.push(_input.name + "=" + _input.value);
					}
				}
			}else if(_input.type != "submit" && _input.type != "button" && _input.type != "file"){
				if(isJson){
					jsonStr += "\"" + _input.name + "\":\"" + _input.value.replace(/\"/g, "\\\"") + "\",";	
				}else{
					paramArray.push(_input.name + "=" + encodeURI(_input.value));	
				}
			}
		}
		var result;
		if(isJson){
			jsonStr = jsonStr.substring(0, jsonStr.length - 1);
			result = jsonStr + "}";
		}else{
			result = paramArray.join("&");
		}
		return result;
	}
	
	window.AjaxUpload = AjaxUpload;
})(window);
