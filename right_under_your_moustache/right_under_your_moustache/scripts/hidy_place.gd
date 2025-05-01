extends StaticBody2D

@onready var interactable: Area2D = $Interactable
@onready var augusto: CharacterBody2D = $"../../augusto"

var hidding = true

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	interactable.interact = _on_interact

func _on_interact(key_pressed: String):
	if key_pressed == "Enter":
		if hidding:
			$Interactable.interact_name = "Press Enter to stop hidding"
			augusto.animated_sprite.play("idle")
			augusto.collision_layer = 2
			augusto.collision_mask = 2
			augusto.animated_sprite.modulate = Color(1, 1, 1, 0.2)
			augusto.disable_player_movement = true
			hidding = false
		else:
			$Interactable.interact_name = "Press Enter to hide behind the pillar"
			augusto.collision_layer = 1
			augusto.collision_mask = 1
			augusto.animated_sprite.modulate = Color(1, 1, 1, 1)
			augusto.disable_player_movement = false
			hidding = true
