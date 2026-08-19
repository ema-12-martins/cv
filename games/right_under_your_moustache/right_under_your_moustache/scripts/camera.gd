extends Node2D

@onready var area_2d: Area2D = $Area2D
@onready var polygon_2d: Polygon2D = $Polygon2D

var local_equal_inicial = true

func _ready() -> void:
	area_2d.body_entered.connect(_on_body_entered)
	
func _on_body_entered(body: Node2D) -> void:
	if body.name == "augusto":
		#Create sound interacting
		var audio_player = AudioStreamPlayer2D.new()
		audio_player.stream = preload("res://music/metal_gear_short.mp3")  
		audio_player.bus = "Master"  
		audio_player.global_position = global_position 
		
		audio_player.max_distance = 10_000_000
		
		audio_player.volume_db = -15
		
		get_parent().add_child(audio_player)
		audio_player.play()
			
		Global.reload_scene(body.get_path())

func _on_flip_camera_timeout() -> void:
	area_2d.scale.x *= -1
	polygon_2d.scale.x *= -1
	
	if local_equal_inicial == true:
		local_equal_inicial = false
		area_2d.position.x -= 180
		polygon_2d.position.x -= 180
	elif local_equal_inicial == false:
		local_equal_inicial = true
		area_2d.position.x += 180
		polygon_2d.position.x += 180
