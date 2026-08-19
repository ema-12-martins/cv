package com.example.receitas

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.ArrayAdapter
import android.widget.EditText
import android.widget.Spinner
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.AppCompatButton
import com.example.receitas.R
import org.json.JSONArray
import java.io.File

class ChangeRecipe : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_change_recipe)

        val recipeId = intent.getStringExtra("RECIPE_ID") ?: ""
        Log.d("DEBUG", "Receita ID recebido: $recipeId")

        val recipeName = intent.getStringExtra("RECIPE_NAME")
        val recipeTime = intent.getStringExtra("RECIPE_TIME")
        val recipeDifficult = intent.getStringExtra("RECIPE_DIFFICULT")
        val recipeIngredients = intent.getStringExtra("RECIPE_INGREDIENTS")
        val recipeSteps = intent.getStringExtra("RECIPE_STEPS")

        val nomeEditText = findViewById<EditText>(R.id.edit_text_nome)
        val tempoEditText = findViewById<EditText>(R.id.edit_text_tempo)
        val dificuldadeSpinner = findViewById<Spinner>(R.id.difficultySpinner)
        val ingredientesEditText = findViewById<EditText>(R.id.edit_text_ingredientes)
        val passosEditText = findViewById<EditText>(R.id.edit_text_passos)

        nomeEditText.setText(recipeName)
        tempoEditText.setText(recipeTime)

        // Remover numeração ao exibir
        val ingredientesLimpos = recipeIngredients?.split("\n")?.joinToString("\n") {
            it.replace(Regex("^[-–]\\s*"), "")
        }
        val passosLimpos = recipeSteps?.split("\n")?.joinToString("\n") {
            it.replace(Regex("^\\d+\\.\\s*"), "")
        }

        ingredientesEditText.setText(ingredientesLimpos)
        passosEditText.setText(passosLimpos)

        val dificuldadeOptions = listOf("Fácil", "Médio", "Difícil")
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, dificuldadeOptions)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        dificuldadeSpinner.adapter = adapter

        val index = dificuldadeOptions.indexOf(recipeDifficult)
        if (index >= 0) {
            dificuldadeSpinner.setSelection(index)
        }

        val btnVoltar = findViewById<AppCompatButton>(R.id.btnVoltar)
        btnVoltar.setOnClickListener {
            finish()
        }

        val btnModificar = findViewById<AppCompatButton>(R.id.btnModificar)
        btnModificar.setOnClickListener {

            val builder = AlertDialog.Builder(this)
            builder.setTitle("CONFIRMAR MODIFICAÇÃO!")
            builder.setMessage("Tem a certeza que deseja modificar a receita?")

            builder.setPositiveButton("Sim") { dialog, which ->
                val nome = nomeEditText.text.toString()
                val tempo = tempoEditText.text.toString()
                val dificuldade = dificuldadeSpinner.selectedItem.toString()

                val ingredientes = ingredientesEditText.text.toString()
                    .split("\n")
                    .map { it.replace(Regex("^[-–]\\s*"), "") }

                val passos = passosEditText.text.toString()
                    .split("\n")
                    .map { it.replace(Regex("^\\d+\\.\\s*"), "") }

                val sucesso = changeRecipe(recipeId, nome, tempo, dificuldade, ingredientes, passos)
                if (sucesso) {
                    Toast.makeText(this, "Receita modificada com sucesso!", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this, MainActivity::class.java)
                    startActivity(intent)
                    finish()
                } else {
                    Toast.makeText(this, "Erro ao modificar a receita.", Toast.LENGTH_SHORT).show()
                }
            }

            builder.setNegativeButton("Não") { dialog, which ->
                dialog.dismiss()
            }

            val dialog = builder.create()
            dialog.show()

            // Troca a cor dos botões após exibir o diálogo
            val textColor = android.graphics.Color.parseColor("#A52A2A")
            dialog.getButton(AlertDialog.BUTTON_POSITIVE)?.setTextColor(textColor)
            dialog.getButton(AlertDialog.BUTTON_NEGATIVE)?.setTextColor(textColor)

        }
    }

    private fun changeRecipe(
        id: String,
        nome: String,
        tempo: String,
        dificuldade: String,
        ingredientes: List<String>,
        passos: List<String>
    ): Boolean {
        try {
            val file = File(filesDir, "receitas.json")
            if (!file.exists()) return false

            val jsonArray = JSONArray(file.readText())

            // Encontra a receita com o ID correspondente
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                if (obj.getString("_id") == id) {
                    obj.put("nome", nome)
                    obj.put("foto", "r$id.jpeg")
                    obj.put("tempo_preparacao", tempo)
                    obj.put("dificuldade", dificuldade)
                    obj.put("ingredientes", JSONArray(ingredientes))
                    obj.put("passos", JSONArray(passos))
                    break
                }
            }

            file.writeText(jsonArray.toString(4))
            return true

        } catch (e: Exception) {
            e.printStackTrace()
            return false
        }
    }
}
