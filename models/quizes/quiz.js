module.exports = function(sequelize, DataTypes){
	return {
		model: sequelize.define("Quiz",{
			pregunta: {
				type:DataTypes.STRING,
				validate:{notEmpty: {msg: "Falta pregunta"}}
			},
		    respuesta: {
		  		type:DataTypes.STRING,
		  		validate:{notEmpty: {msg: "Falta respuesta"}}
		  	},
		    tematica: {
		  		type:DataTypes.STRING,
		  		validate:{notEmpty: {msg: "Falta temática"}}
		    }
		}),
		glue: function(models){
			models["quiz"].model.hasMany(models["comment"].model);
		}
	}
} 
