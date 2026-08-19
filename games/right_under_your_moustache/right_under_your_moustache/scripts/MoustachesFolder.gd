extends StaticBody2D

@onready var interactable: Area2D = $Interactable

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	
	interactable.interact = _on_interact

func _on_interact(key_pressed: String):
	if key_pressed == "Left Mouse Button":
		#Create sound interacting
		var audio_player = AudioStreamPlayer2D.new()
		audio_player.stream = preload("res://music/button_short.mp3")  
		audio_player.bus = "Master"  
		audio_player.global_position = global_position 
		
		audio_player.max_distance = 10_000_000
		
		get_parent().add_child(audio_player)
		audio_player.play()
		
		await get_tree().create_timer(1).timeout 
	
		get_tree().change_scene_to_file("res://scenes/moustaches_folder.tscn")
