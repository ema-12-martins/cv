extends Control

@onready var race_time: Label = $Labels/race_time
@onready var best_time: Label = $Labels/best_time

func _ready():
	var minutes = Global.race_time / 60.0
	var seconds = Global.race_time % 60
	race_time.text = "Race time: %02d:%02d" % [minutes, seconds]
	
	minutes = Global.best_time / 60.0
	seconds = Global.best_time % 60
	best_time.text = "Best time: %02d:%02d" % [minutes, seconds]
	$VBoxContainer/restart.connect("mouse_entered", func(): _on_mouse_entered($VBoxContainer/restart))
	$VBoxContainer/exit.connect("mouse_entered", func(): _on_mouse_entered($VBoxContainer/exit))

func _on_restart_pressed() -> void:
	#Create sound interacting
	var audio_player = AudioStreamPlayer2D.new()
	audio_player.stream = preload("res://music/button_short.mp3")  
	audio_player.bus = "Master"  
	audio_player.global_position = global_position 
	
	audio_player.max_distance = 10_000_000
	
	get_parent().add_child(audio_player)
	audio_player.play()
	
	Global.global_scene_instance = preload("res://scenes/hud.tscn").instantiate()
	Global.replay()

func _on_exit_pressed() -> void:
	#Create sound interacting
	var audio_player = AudioStreamPlayer2D.new()
	audio_player.stream = preload("res://music/button_short.mp3")  
	audio_player.bus = "Master"  
	audio_player.global_position = global_position 
	
	audio_player.max_distance = 10_000_000
	
	get_parent().add_child(audio_player)
	audio_player.play()
	
	get_tree().quit()

func _on_mouse_entered(button) -> void:
	button.grab_focus()

func _on_restart_focus_entered() -> void:
	#Create sound interacting
	var audio_player = AudioStreamPlayer2D.new()
	audio_player.stream = preload("res://music/button_short.mp3")  
	audio_player.bus = "Master"  
	audio_player.global_position = global_position 
	
	audio_player.max_distance = 10_000_000
	
	get_parent().add_child(audio_player)
	audio_player.play()
	
	$VBoxContainer/restart.add_theme_color_override("font_hover_color", Color("#ffff4c"))

func _on_restart_focus_exited() -> void:
	$VBoxContainer/restart.add_theme_color_override("font_hover_color", Color("#FFFFFF"))

func _on_exit_focus_entered() -> void:
	#Create sound interacting
	var audio_player = AudioStreamPlayer2D.new()
	audio_player.stream = preload("res://music/button_short.mp3")  
	audio_player.bus = "Master"  
	audio_player.global_position = global_position 
	
	audio_player.max_distance = 10_000_000
	
	get_parent().add_child(audio_player)
	audio_player.play()
	
	$VBoxContainer/exit.add_theme_color_override("font_hover_color", Color("#ffff4c"))

func _on_exit_focus_exited() -> void:
	$VBoxContainer/exit.add_theme_color_override("font_hover_color", Color("#FFFFFF"))

func _on_ready() -> void:
	$VBoxContainer/restart.grab_focus()
