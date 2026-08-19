extends Node

func _ready() -> void:
	var node_name = str(Global.code[1]) + "ducks"
	var parent_node = get_node(node_name)
	for child in parent_node.get_children():
		child.position.x += 275
		
	node_name = str(Global.code[2]) + "ducks"
	parent_node = get_node(node_name)
	for child in parent_node.get_children():
		child.position.x += 580
	
	node_name = str (Global.code[3]) + "ducks"
	parent_node = get_node(node_name)
	for child in parent_node.get_children():
		child.position.x += 865
		
