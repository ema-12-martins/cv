extends Node2D

func _ready() -> void:
	if Global.last_office_position != Vector2(0, 0):
		$augusto.position = Global.last_office_position
	if Global.got_exam == 1:
		$Label.visible = true
		$CleaningLady/LadyDosCleanings.visible = true
		$CleaningLady/Marker2D.visible = true
		$CleaningLady/LadyDosCleanings.animated_sprite.play("office")
		$CleaningLady/LadyDosCleanings.collision_layer = 1
		$CleaningLady/LadyDosCleanings.collision_mask = 1
		$CleaningLady/LadyDosCleanings.speed = 350
		$PC/Interactable.interact_name = ""
		
