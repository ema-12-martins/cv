extends StaticBody2D

@onready var interactable: Area2D = $Interactable

func _ready() -> void:
	interactable.interact = _on_interact

func _on_interact(_key_pressed: String):
	if Global.got_exam == 1:
		call_deferred("end_game")

func end_game():
	if Global.best_time > Global.elipsed_time_in_seconds:
		Global.best_time = Global.elipsed_time_in_seconds
		
	Global.race_time = Global.elipsed_time_in_seconds
	
	
	# Reset posições, chaves, exames e tentativas caixotes
	Global.keys = 0  
	Global.last_world_position = Vector2(0, 0)
	Global.last_office_position = Vector2(0, 0)
	Global.bin_tries = 0
	Global.got_exam = 0
	
	#Reset the time
	Global.time_mutex.lock()
	Global.elipsed_time_in_seconds = 0
	Global.time_mutex.unlock()
	
	# Take of the hud
	Global.global_scene_instance.queue_free()
	Global.global_scene_instance = null
	
	get_tree().change_scene_to_file("res://scenes/final_menu.tscn")
