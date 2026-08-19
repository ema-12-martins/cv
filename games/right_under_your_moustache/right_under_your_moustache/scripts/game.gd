extends Node2D

func _ready() -> void:
	call_deferred("_initialize")
	
func _initialize() -> void:
	if Global.keys == 1:
		$Door/OfficeDoor/Interactable.interact_name = "Press Enter to enter the office"
	if Global.last_world_position != Vector2(0, 0):
		$augusto.position = Global.last_world_position
	if Global.got_exam == 1:
		$Exit/Interactable.interact_name = "Press Enter to exit"
