extends Control


func _on_ready() -> void:
	$VBoxContainer/StartButton.grab_focus()


func _ready():
	$VBoxContainer/StartButton.connect("mouse_entered", func(): _on_mouse_entered($VBoxContainer/StartButton))
	$VBoxContainer/QuitButton.connect("mouse_entered", func(): _on_mouse_entered($VBoxContainer/QuitButton))

func _on_mouse_entered(button) -> void:
	button.grab_focus()

func _on_start_button_pressed() -> void:
	#Create sound interacting
	var audio_player = AudioStreamPlayer2D.new()
	audio_player.stream = preload("res://music/button_short.mp3")  
	audio_player.bus = "Master"  
	audio_player.global_position = global_position 
	
	audio_player.max_distance = 10_000_000
	
	get_parent().call_deferred("add_child", audio_player)
	audio_player.call_deferred("play")
		
	Global.global_scene_instance = preload("res://scenes/hud.tscn").instantiate()
	get_tree().change_scene_to_file("res://scenes/game.tscn")
	
func _on_quit_button_pressed() -> void:
	#Create sound interacting
	var audio_player = AudioStreamPlayer2D.new()
	audio_player.stream = preload("res://music/button_short.mp3")  
	audio_player.bus = "Master"  
	audio_player.global_position = global_position 
	
	audio_player.max_distance = 10_000_000
	
	get_parent().call_deferred("add_child", audio_player)
	audio_player.call_deferred("play")
	
	get_tree().quit()

func _on_start_button_focus_exited() -> void:
	#Create sound interacting
	var audio_player = AudioStreamPlayer2D.new()
	audio_player.stream = preload("res://music/button_short.mp3")  
	audio_player.bus = "Master"  
	audio_player.global_position = global_position 
	
	audio_player.max_distance = 10_000_000
	
	get_parent().call_deferred("add_child", audio_player)
	audio_player.call_deferred("play")
	
	$VBoxContainer/StartButton.add_theme_color_override("font_hover_color", Color("#FFFFFF"))

func _on_start_button_focus_entered() -> void:
	#Create sound interacting
	var audio_player = AudioStreamPlayer2D.new()
	audio_player.stream = preload("res://music/button_short.mp3")  
	audio_player.bus = "Master"  
	audio_player.global_position = global_position 
	
	audio_player.max_distance = 10_000_000
	
	get_parent().call_deferred("add_child", audio_player)
	audio_player.call_deferred("play")
	
	$VBoxContainer/StartButton.add_theme_color_override("font_hover_color", Color("#ffff4c"))

func _on_quit_button_focus_entered() -> void:
	$VBoxContainer/QuitButton.add_theme_color_override("font_hover_color", Color("#ffff4c"))

func _on_quit_button_focus_exited() -> void:
	$VBoxContainer/QuitButton.add_theme_color_override("font_hover_color", Color("#FFFFFF"))
