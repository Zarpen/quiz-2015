module.exports = function(sequelize, DataTypes){
	return {
		model: sequelize.define("User",{
			email: {
			  type:DataTypes.STRING,
			  isUnique :true,
	          allowNull:false,
	          validate:{
	            isEmail : {
	            	msg: "La dirección de email no es válida"
	            }
	          }
			},
			password: {
			  type:DataTypes.STRING,
			  allowNull:false,
			  validate:{
			  	isValidPassword: function (value, next) {
			  		if(value && value != null && value != undefined){
			  			var self = this;
	                    var match = value.match(/(?=[^\d_].*?\d)\w(\w|[!@#$%]){7,20}/);
	                    if(match && match != null && match != undefined){
	                    	return next();
	                    }else{
	                    	return next("La contraseña debe tener al menos 8 carácteres con letras y números");
	                    }
			  		}else{
			  			return next("La contraseña no puede estar vacia");
			  		} 
                }
			  }
			},
			token: {
			  type:DataTypes.STRING,
			  allowNull:true
			}
		}),
		glue: function(models){
			//models["comment"].model.belongsTo(models["quiz"].model);
		}
	}
}