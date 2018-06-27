	app={
		config:{
			location	: window.location,
			path 		: 'web2',
			lang		: 'de',
			sessionStorage: "mmUserName",
			ajax:{
				ipInfo 	: 'https://ipapi.co/json',
				login 	: 'https://api.platinumstrade.com/account/logon',
				logout 	: 'https://api.platinumstrade.com/account/logoff',
				register: 'https://api.platinumstrade.com/Registration/Full',
				},
		},
		do:{
			getInfo:function(){
				$.get(app.config.ajax.ipInfo, function(data) {
					getInfo=data;
					//$('#user_phone_number').val(getInfo.country_calling_code);
				});
			},
			login:function(email,password){
				$.ajax({
					"xhrFields": { withCredentials: true },
					"url": app.config.ajax.login,
					"method": "POST",
					"data": {	
							"email"    : email,
							"password" : password
							}
				}).done(function (response,status,xhr) {
					if (status="success") {
						window.sessionStorage.setItem(app.config.sessionStorage,response.firstName+' '+response.lastName);
						app.do.goto("deposit");
					}
				}).fail(function(response){
					errors=JSON.parse(response.responseText).message;
					errors=errors.split('.');
					for (var i = 0; i < errors.length-1; i++) {
						toastr.error(errors[i]);
					}
					$('[name="password"]').val('');
				});
			},
			logout:function(){
				$.ajax({
					"xhrFields": { withCredentials: true },
					"url": app.config.ajax.logout,
					"method": "POST",
				})
				.done(function(response) {
					window.sessionStorage.removeItem(app.config.sessionStorage);
					app.do.goto("login");
				})
				.fail(function() {
					console.log("error");
				});
			},
			registration:function(){
				var fname=$('[name="name"]').val().split(' ')[0];
				var lname=$('[name="name"]').val().split(' ')[1];
				var phone=$('[name="phone"]').val().substring(getInfo.country_calling_code.length,$('[name="phone"]').val().length);
				var phone_code=$('[name="phone"]').val().substring(0,getInfo.country_calling_code.length).replace('+','');
				var phone_operator=$('[name="phone"]').val().substring(phone_code.length+1,phone_code.length+3);
				phoneSend=phone.substring(phone_operator.length,phone.length);
				
				$.ajax({
					url: app.config.ajax.register,
					type: 'GET',
					xhrFields: { withCredentials: true },
					data:{	
						FirstName: fname,
						LastName:  lname,
						Email: 	  $('[name="email"]').val(),
						Password: $('[name="password"]').val(),
						PhoneCountry: phone_code,
						PhoneOperator: phone_operator,
						PhoneNumber:  phoneSend,
						Country:getInfo.country,
						Terms:true
					},
				})
				.done(function(response) {
					$.ajax({
				     	url: '/api/v01/register',
				     	type: 'POST',
				     	dataType: 'JSON',
				     	data:{
				     		first_name: fname,
				     		last_name: lname,
				     		email: $('[name="email"]').val(),
				     		source:document.domain,
				     		phone_code:phone_code,
				     		phone_number:phone_operator+phoneSend,
				     		country:getInfo.country_name,
				     	}
				     })
				     .done(function(data) {
				     	console.log(data);
				     })
				     .fail(function(error) {
				     	console.log(error.responseText);
				     })
				     .always(function() {
				     	app.do.login($('[name="email"]').val(),$('[name="password"]').val());
				     	app.do.goto(app.config.lang+'/app');
				     });
				})
				.fail(function(response) {
					errors=JSON.parse(response.responseText).message;
					errors=errors.split('.');
					for (var i = 0; i < errors.length-1; i++) {
						toastr.error(errors[i]);
					}
				});
			},
			home:function(){
				$.get(app.config.ajax.ipInfo, function(data) {
					$('[name="phone"]').val(data.country_calling_code);
					$('[name="phone2"]').val(data.country_calling_code);
					$('[name="phone_exit"]').val(data.country_calling_code);
				});
				// $('[name="submit"]').on('click',function(event) {
				// 	app.do.registration();
			 //   });
			},
			run:function() {
			    route=window.location.pathname.split("/");
			    route=route[route.length-2];
				switch(route) {
					case "signin":
						$('.btn-sign-in').on('click',function(event) {
							event.preventDefault();
							app.do.login($('#login-user-email').val(),$('#login-user-password').val());
						});
						break;
					case "signup":
						app.do.getInfo();
						url= new URL(window.location.href);
						if(window.sessionStorage.getItem('fullname')){
							$('#user_full_name').val(window.sessionStorage.getItem('fullname'));
						}
						if(window.sessionStorage.getItem('email')){
							$('#user_email').val(window.sessionStorage.getItem('email'));
						}
						if(window.sessionStorage.getItem('phone')){
							$('#user_phone_number').val(window.sessionStorage.getItem('phone'));
						}
						window.sessionStorage.removeItem('phone');
						window.sessionStorage.removeItem('fullname');
						$('.signup-btn').on('click',function(event) {
							event.preventDefault();
							app.do.registration();
						});	
						break;
					case "deposit":
					case "settings":
					case "brokers":
					case "faq":
						if (!sessionStorage.getItem(app.config.sessionStorage)) {
							app.do.goto("signin");
							return;
						}
						$('.user-name').text(window.sessionStorage.getItem(app.config.sessionStorage));
						$('#logout-btn').on('click',function(event) {
							event.preventDefault();
							app.do.logout();
						});
						break;
					case "settings":
						$('.user-name').text(window.sessionStorage.getItem(app.config.sessionStorage));
						break;
					case "":
					case app.config.location:
					case app.config.lang:
						app.do.getInfo();
						app.do.home();
						break;
				}
			},
			goto:function(to){
				var paths = location.pathname.split('/');
				paths[ paths.length-2 ] = to;
				location.pathname = paths.join('/');
			}
		}
	}
$(document).ready(function(){
	app.do.run();
});