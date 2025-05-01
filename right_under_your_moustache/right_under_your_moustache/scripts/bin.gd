extends Area2D

@onready var label: Label = $"../Label"

var inside_area = false

func _on_body_entered(body: Node2D) -> void:
	if body.name == "augusto" and Global.keys == 0:
		label.visible = true
		inside_area = true

func _on_body_exited(body: Node2D) -> void:
	if body.name == "augusto":
		label.visible = false
		inside_area = false

func _process(_delta: float) -> void:
	if inside_area and Input.is_action_just_pressed("ui_accept") and Global.keys == 0 and label.text == "Press Enter to check the trash bin.":  # 'ui_accept' == Enter
		if RandomNumberGenerator.new().randi_range(1, 3) == 1 or Global.bin_tries == 2:
			$"../../../Door/OfficeDoor/Interactable".interact_name = "Press Enter to enter the office"
			Global.keys += 1
			label.text = "You found a key!"
			
			#Create sound interacting
			var audio_player = AudioStreamPlayer2D.new()
			audio_player.stream = preload("res://music/treasure_discovery_sound.mp3")  
			audio_player.bus = "Master"  
			audio_player.global_position = global_position 
			
			audio_player.max_distance = 10_000_000
			
			get_parent().add_child(audio_player)
			audio_player.play()
			
		else:
			label.text = "You found nothing"
			Global.bin_tries += 1
			
			#Create sound interacting
			var audio_player = AudioStreamPlayer2D.new()
			audio_player.stream = preload("res://music/paper_short.mp3")  
			audio_player.bus = "Master"  
			audio_player.global_position = global_position 
			
			audio_player.max_distance = 10_000_000
			
			get_parent().add_child(audio_player)
			audio_player.play()
