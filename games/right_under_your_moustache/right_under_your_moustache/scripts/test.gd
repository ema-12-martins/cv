extends StaticBody2D

@onready var interactable: Area2D = $Interactable
@onready var augusto: CharacterBody2D = $"../../augusto"
@onready var collision_shape_level_0: CollisionShape2D = $"../../Levels/level_0/CollisionShape2D"
@onready var collision_shape_level_1: CollisionShape2D = $"../../Levels/level_1/CollisionShape2D"

@onready var levels: Node = $"../../Levels"


# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	interactable.interact = _on_interact

func _on_interact(key_pressed: String):

	if levels.level == 0 and (key_pressed == "W" or key_pressed == "Up"):
		#Create sound interacting
		var audio_player = AudioStreamPlayer2D.new()
		audio_player.stream = preload("res://music/stairs_short.mp3")  
		audio_player.bus = "Master"  
		audio_player.global_position = global_position 
		
		audio_player.max_distance = 10_000_000
		
		audio_player.volume_db = 10.0 
		
		get_parent().add_child(audio_player)
		audio_player.play()
		
		#Time for the sound to work
		augusto.visible=false
		augusto.process_mode = Node.PROCESS_MODE_DISABLED
		await get_tree().create_timer(1).timeout 
		augusto.visible=true
		augusto.process_mode = Node.PROCESS_MODE_INHERIT
		
		
		augusto.position.y -= 700
		levels.level += 1
	
	elif levels.level == 1 and (key_pressed == "S" or key_pressed == "Down"):
		#Create sound interacting
		var audio_player = AudioStreamPlayer2D.new()
		audio_player.stream = preload("res://music/stairs_short.mp3")  
		audio_player.bus = "Master"  
		audio_player.global_position = global_position 
		
		audio_player.max_distance = 10_000_000
		
		audio_player.volume_db = 10
		
		get_parent().add_child(audio_player)
		audio_player.play()
		
		#Time for the sound to work
		augusto.visible=false
		augusto.process_mode = Node.PROCESS_MODE_DISABLED
		await get_tree().create_timer(1).timeout 
		augusto.visible=true
		augusto.process_mode = Node.PROCESS_MODE_INHERIT
		
		augusto.position.y += 800
		levels.level -= 1
