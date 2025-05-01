extends Control

@onready var fields = [$LineEdit, $LineEdit2, $LineEdit3, $LineEdit4]

func _ready() -> void:
	for i in range(fields.size()):
		fields[i].text_changed.connect(_on_text_changed.bind(i))
		fields[i].gui_input.connect(_on_gui_input.bind(i))
		fields[i].text_submitted.connect(_on_text_submitted)

func _on_text_changed(_character, index) -> void:
	$"../Label2".visible = false
	if fields[index].text != "" and index < fields.size() - 1:
		
		#Create sound interacting
		var audio_player = AudioStreamPlayer2D.new()
		audio_player.stream = preload("res://music/button_short.mp3")  
		audio_player.bus = "Master"  
		audio_player.global_position = global_position 
		
		audio_player.max_distance = 10_000_000
		
		get_parent().add_child(audio_player)
		audio_player.play()
	
		fields[index + 1].grab_focus()

func _on_gui_input(event, index) -> void:
	if event is InputEventKey and event.pressed:
		if event.keycode == KEY_BACKSPACE and fields[index].text == "" and index > 0:
			fields[index - 1].grab_focus()
			fields[index - 1].clear()

func _on_text_submitted(_character) -> void:
	var password = ""
	for field in fields:
		password += field.text
	if password == Global.code:
		$"../Label".visible = false
		$"../Label2".visible = false
		for field in fields:
			field.visible = false
			field.editable = false
		$"../../TileMap/PassScreen".visible = false
		$"../../Download/Interactable/CollisionShape2D".disabled = false
	else:
		for field in fields:
			field.clear()
		fields[0].grab_focus()
		$"../Label2".visible = true
