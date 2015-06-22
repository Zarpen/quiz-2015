module.exports = function(sequelize, DataTypes){
	return {
		model: sequelize.define("Comment",{
			texto: {
			  type:DataTypes.STRING,
			  validate: { notEmpty: {msg: "Falta Comentario"}}
			},
			publicado: {
			  type:DataTypes.BOOLEAN,
			  defaultValue: false
			}
		}),
		glue: function(models){
			models["comment"].model.belongsTo(models["quiz"].model);
		}
	}
}
