extends Node2D
		
func _input(event: InputEvent) -> void:
	if event.is_action_pressed("Leave"):
		#Create sound interacting
		var audio_player = AudioStreamPlayer2D.new()
		audio_player.stream = preload("res://music/button_short.mp3")  
		audio_player.bus = "Master"  
		audio_player.global_position = global_position 
		
		audio_player.max_distance = 10_000_000
		
		get_parent().add_child(audio_player)
		audio_player.play()
		
		await get_tree().create_timer(1).timeout 
		
		get_tree().change_scene_to_file("res://scenes/pc.tscn")
