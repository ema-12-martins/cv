extends Timer

@onready var augusto: CharacterBody2D = $".."
@onready var speed_timer: Timer = $"."

func _on_timeout() -> void:
	augusto.SPEED -= 800
	augusto.velocity_speed = false
	speed_timer.stop()
