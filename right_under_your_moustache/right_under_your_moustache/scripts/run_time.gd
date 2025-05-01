extends Timer
@onready var run_timer: Timer = $"."
@onready var current_time: Label = $"../current_time"

func _ready() -> void:
	run_timer.start()
	var minutes = Global.elipsed_time_in_seconds / 60.0
	var seconds = Global.elipsed_time_in_seconds % 60
	current_time.text = "%02d:%02d" % [minutes, seconds]
	
func _on_timeout() -> void:
	Global.elipsed_time_in_seconds += 1
	var minutes = Global.elipsed_time_in_seconds / 60.0
	var seconds = Global.elipsed_time_in_seconds % 60
	current_time.text = "%02d:%02d" % [minutes, seconds]
	run_timer.start()
