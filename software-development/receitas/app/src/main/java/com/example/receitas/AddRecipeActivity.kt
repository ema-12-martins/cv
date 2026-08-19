package com.example.receitas

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

class AddRecipeActivity : AppCompatActivity() {

    private var selectedDifficulty: String = "Fácil" // Valor por defeito

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_recipe)

        // Spinner de dificuldade
        val spinner: Spinner = findViewById(R.id.difficultySpinner)
        val options = arrayOf("Fácil", "Médio", "Difícil")
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, options)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinner.adapter = adapter

        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                selectedDifficulty = options[position]
            }

            override fun onNothingSelected(parent: AdapterView<*>) {
                selectedDifficulty = "Fácil"
            }
        }

        val voltarButton = findViewById<Button>(R.id.btnVoltar)
        voltarButton.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }


        // Referências aos campos de input
        val nomeEditText = findViewById<EditText>(R.id.edit_text_nome)
        val ingredientesEditText = findViewById<EditText>(R.id.edit_text_ingredientes)
        val passosEditText = findViewById<EditText>(R.id.edit_text_passos)
        val tempoConfecaoEditText = findViewById<EditText>(R.id.edit_text_tempo)
        val adicionarButton = findViewById<Button>(R.id.btnAdicionar)

        // Botão de adicionar receita
        adicionarButton.setOnClickListener {
            val ingredientes = ingredientesEditText.text.toString().trim()
            val passos = passosEditText.text.toString().trim()
            val tempoConfecao = tempoConfecaoEditText.text.toString().trim()

            // Verifica se todos os campos estão preenchidos
            if (ingredientes.isEmpty() || passos.isEmpty() || tempoConfecao.isEmpty()) {
                Toast.makeText(this, "Preencha todos os campos!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Cria o objeto da nova receita
            val novaReceita = JSONObject().apply {
                put("nome", nomeEditText.text.toString().trim())
                put("tempo_preparacao", tempoConfecao)
                put("dificuldade", selectedDifficulty)

                // Converte ingredientes e passos separados por nova linha para JSONArray
                val ingredientesArray = JSONArray(ingredientes.split("\n"))
                val passosArray = JSONArray(passos.split("\n"))

                put("ingredientes", ingredientesArray)
                put("passos", passosArray)
            }


            // Adiciona a receita ao ficheiro JSON
            addRecipeToJson(this, novaReceita)

            Toast.makeText(this, "Receita adicionada com sucesso!", Toast.LENGTH_SHORT).show()

            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)

            finish()
        }
    }

    private fun addRecipeToJson(context: Context, novaReceita: JSONObject) {
        val file = File(context.filesDir, "receitas.json")

        // Cria o ficheiro se ainda não existir
        if (!file.exists()) {
            file.writeText("[]")
        }

        // Lê o ficheiro existente
        val jsonArray = JSONArray(file.readText())
        var maxId = 0

        // Encontra o maior ID atual
        for (i in 0 until jsonArray.length()) {
            val receita = jsonArray.getJSONObject(i)
            val id = receita.optString("_id")
            val match = Regex("""r(\d+)""").find(id)
            val num = match?.groupValues?.get(1)?.toIntOrNull()
            if (num != null && num > maxId) {
                maxId = num
            }
        }

        // Gera novo ID e adiciona à nova receita
        val novoId = maxId + 1
        val id = "r$novoId"
        novaReceita.put("_id", id)
        novaReceita.put("foto", "$id.jpeg")

        // Adiciona ao array e escreve no ficheiro
        jsonArray.put(novaReceita)
        file.writeText(jsonArray.toString(4)) // Salva formatado
    }
}
