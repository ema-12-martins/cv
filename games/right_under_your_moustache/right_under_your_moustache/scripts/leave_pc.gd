extends Node2D

func _ready() -> void:
	$CharacterBody2D/InteractingComponent.interact_label.label_settings.font_size = 30
	$CharacterBody2D/InteractingComponent.interact_label.label_settings.outline_size = 12

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
		
		if Global.got_exam == 1:
			var background = BackgroundMusic.get_node("/root/BackgroundMusic")
			background.pitch_scale = 1.5
		
		$CharacterBody2D/InteractingComponent.interact_label.label_settings.font_size = 50
		$CharacterBody2D/InteractingComponent.interact_label.label_settings.outline_size = 15
		get_tree().change_scene_to_file("res://scenes/office.tscn")
