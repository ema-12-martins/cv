extends CanvasLayer

@onready var keys: Label = $"Control/MarginContainer-Keys/HBoxContainer/keys"
@onready var exam: Label = $"Control/MarginContainer-Exam/HBoxContainer/Exam"

func _ready():
	update_keys_and_exam_label()  # Atualiza o HUD ao iniciar
	Global.keys_and_exam_updated.connect(update_keys_and_exam_label) 

func update_keys_and_exam_label():
	if is_instance_valid(keys):  # Evita erro se ainda nao tiver carregada
		keys.text = str(Global.keys) + "/1"
	if is_instance_valid(exam):  # Evita erro se ainda nao tiver carregada
		exam.text = str(Global.got_exam) + "/1"
