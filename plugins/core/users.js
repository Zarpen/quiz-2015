module.exports = {
	handlerGetLogin:function(req,res,next){
		this.viewVars.layout.title = "LogIn";
		var user = this.dbHelper.getModel("user").build({
			email: "",
			password: ""
		});
		this.viewVars.login.user = user;
		return this.parseView({view:"layout",render:true,response:res,vars:this.viewVars.layout,partials:[
			{view:"login",vars:this.viewVars.login,linkVar:"body"}
		]});
	},
	handlerLogin:function(req,res,next){
		var anchor = this;
		var user = this.dbHelper.getModel("user").build({
			email: req.body.email,
			password: req.body.password
		});
		user.validate().then(function(err){
			if(err){
				if(!req.body.api){
					anchor.viewVars.login.user = {email:"",password:""};
					anchor.viewVars.layout.errors = err.errors;
					return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
						{view:"login",vars:anchor.viewVars.register,linkVar:"body"}
					],handler:function(){ anchor.viewVars.layout.errors = ""; }});
				}else{
					return res.json({
	                    type: false,
	                    data: err.errors
	                }); 
				}
			}else{
				anchor.dbHelper.getModel("user").findOne({where:{email: req.body.email}}).then(function(user1){
					if (user1) {
						// check password
						if(anchor.bcrypt.compareSync(req.body.password, user1.password)){
							if(!req.body.api){
								req.session.token = user1.token;
								req.session.tokenExpire = (new Date()).getTime();
								anchor.authToken = req.session.token;
								return res.redirect(req.session.redir.toString());
							}else{
								return res.json({
				                    type: true,
				                    data: user1,
				                    token: user1.token
				                });
							}
						}else{
							if(!req.body.api){
								anchor.viewVars.login.user = user1;
								anchor.viewVars.login.user.password = "";
								anchor.viewVars.layout.errors = [{message:"La contraseña no es correcta"}];
								return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
									{view:"login",vars:anchor.viewVars.login,linkVar:"body"}
								],handler:function(){ anchor.viewVars.layout.errors = ""; }});
							}else{
								return res.json({
				                    type: false,
				                    data: "Incorrect email/password"
				                }); 
							}
						}
			        } else {
			        	anchor.viewVars.login.user = {email:"",password:""};
						anchor.viewVars.layout.errors = [{message:"No existe el usuario"}];
						return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
							{view:"login",vars:anchor.viewVars.login,linkVar:"body"}
						],handler:function(){ anchor.viewVars.layout.errors = ""; }});
			        }
				}).catch(function(e){ return next(new Error(e)); });
			}
		}).catch(function(e){ return next(new Error(e)); });
	},
	handlerLogout:function(req,res,next){
		if(!req.body.api){
			delete req.session.token;
			delete req.session.tokenExpire;
			this.authToken = false;
			return res.redirect(req.session.redir.toString());
		}else{
			// logout API
		}
	},
	handlerGetRegister:function(req,res,next){
		this.viewVars.layout.title = "SignIn";
		var user = this.dbHelper.getModel("user").build({
			email: "",
			password: ""
		});
		this.viewVars.register.user = user;
		return this.parseView({view:"layout",render:true,response:res,vars:this.viewVars.layout,partials:[
			{view:"register",vars:this.viewVars.register,linkVar:"body"}
		]});
	},
	handlerRegister:function(req,res,next){
		var anchor = this;
		anchor.dbHelper.getModel("user").findOne({where:{email: req.body.email}}).then(function(user){
			if (user) {
				if(!req.body.api){
					anchor.viewVars.register.user = {email:"",password:""};
					anchor.viewVars.layout.errors = [{message:"ya existe un usuario con ese email"}];
					return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
						{view:"register",vars:anchor.viewVars.register,linkVar:"body"}
					],handler:function(){ anchor.viewVars.layout.errors = ""; }});
				}else{
					return res.json({
	                    type: false,
	                    data: "User already exist"
	                }); 
				}
	        }else{
	        	var user1 = anchor.dbHelper.getModel("user").build({
					email: req.body.email,
					password: req.body.password
				});
				user1.validate().then(function(err){
					if(err){
						if(!req.body.api){
							anchor.viewVars.register.user = {email:"",password:""};
							anchor.viewVars.layout.errors = err.errors;
							return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
								{view:"register",vars:anchor.viewVars.register,linkVar:"body"}
							],handler:function(){ anchor.viewVars.layout.errors = ""; }});
						}else{
							return res.json({
			                    type: false,
			                    data: err.errors
			                }); 
						}
					}else{
						var salt = anchor.bcrypt.genSaltSync(10);
						var hash = anchor.bcrypt.hashSync(req.body.password, salt);
						user1.password = hash;
						user1.save().then(function(){
							user1.token = anchor.jwt.sign(user1, process.env.JWT_SECRET);
							user1.save(function() {
								if(!req.body.api){
									req.session.token = user1.token;
									req.session.tokenExpire = (new Date()).getTime();
									anchor.authToken = req.session.token;
									anchor.viewVars.layout.errors = "";
									return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
										{view:"index",vars:anchor.viewVars.index,linkVar:"body"}
									],handler:function(){ anchor.viewVars.layout.errors = ""; }});
								}else{
									return res.json({
			                            type: true,
			                            data: user1,
			                            token: user1.token
			                        });
								}
		                    });
						});
					}
				});
	        }
		}).catch(function(e){ return next(new Error(e)); });
	}
};
