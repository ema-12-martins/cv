extends Area2D

@onready var label: Label = $"../Label"

@onready var augusto: CharacterBody2D = $"../../../augusto"
@onready var speed_timer: Timer = $"../../../augusto/speed_timer"

var inside_area = false

func _on_body_entered(body: Node2D) -> void:
	if body.name == "augusto" and body.velocity_speed == false:
		inside_area = true 
		label.visible = true
		
func _on_body_exited(body: Node2D) -> void:
	if body.name == "augusto":
		inside_area = false 
		label.visible = false
		
func _process(_delta: float) -> void:
	if inside_area and Input.is_action_just_pressed("ui_accept"):  # 'ui_accept' == Enter
		if augusto.velocity_speed == false:
			label.visible = false
			
			#Create sound interacting
			var audio_player = AudioStreamPlayer2D.new()
			audio_player.stream = preload("res://music/drink_short.mp3")  
			audio_player.bus = "Master"  
			audio_player.global_position = global_position 
			
			audio_player.max_distance = 10_000_000
			
			get_parent().add_child(audio_player)
			audio_player.play()
		
			augusto.SPEED += 800
			augusto.velocity_speed = true
			speed_timer.start()
