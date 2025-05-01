extends StaticBody2D

@onready var interactable: Area2D = $Interactable

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	interactable.interact = _on_interact
		
func _on_interact(key_pressed: String):
	if Global.keys == 1:
		if key_pressed == "Enter":
			#First time entering, create code and put the ducks in the right place
			if Global.generated_code == false:
				Global.generated_code = true
				var numbers = [1, 2, 3, 4]
				numbers.shuffle()
				Global.code = str(numbers[0]) + str(numbers[1]) + str(numbers[2]) +str(numbers[3])

			if Global.got_exam == 1:
					
				var background = BackgroundMusic.get_node("/root/BackgroundMusic")
				background.pitch_scale = 1.5
			
			Global.last_world_position = $"../../augusto".position
			get_tree().change_scene_to_file("res://scenes/office.tscn")
