package com.example.receitas

import android.text.Html
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.text.Spannable
import android.text.SpannableStringBuilder
import android.text.style.StyleSpan
import android.util.Log
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.AppCompatButton
import org.json.JSONArray
import java.io.File

class RecipeDetailActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_recipe_detail)

        val eliminarButton: AppCompatButton = findViewById(R.id.eliminar)
        eliminarButton.setOnClickListener {
            // Criar alert
            val builder = AlertDialog.Builder(this)
            builder.setTitle("CONFIRMAR REMOÇÃO!")
            builder.setMessage("Tem a certeza que deseja eliminar a receita?")

            builder.setPositiveButton("Sim") { dialog, which ->
                val recipeID = intent.getStringExtra("RECIPE_ID")
                eliminarItem(recipeID)
            }
            builder.setNegativeButton("Não") { dialog, which ->
                dialog.dismiss()
            }

            val dialog = builder.create()
            dialog.show()

            // Troca a cor dos botões
            val textColor = android.graphics.Color.parseColor("#A52A2A")
            dialog.getButton(AlertDialog.BUTTON_POSITIVE)?.setTextColor(textColor)
            dialog.getButton(AlertDialog.BUTTON_NEGATIVE)?.setTextColor(textColor)
        }
        val recipeLayout = findViewById<LinearLayout>(R.id.recipeLayout)

        //Get the value from the other side
        val recipeName = intent.getStringExtra("RECIPE_NAME")
        val recipeTime = intent.getStringExtra("RECIPE_TIME")
        val recipeDifficult = intent.getStringExtra("RECIPE_DIFFICULT")
        val recipeIngredients = intent.getStringExtra("RECIPE_INGREDIENTS")
        val recipeSteps = intent.getStringExtra("RECIPE_STEPS")
        val recipeID = intent.getStringExtra("RECIPE_ID")

        // Create LinearLayout for each recipe
        val linearLayout = LinearLayout(this)
        linearLayout.orientation = LinearLayout.VERTICAL
        linearLayout.setPadding(16, 16, 16, 16)

        //Margin between elements
        val params = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )
        params.setMargins(20, 60, 20, 60) // Define margens (esquerda, topo, direita, baixo)
        linearLayout.layoutParams = params

        // Create TextView to the name
        val nameTextView = TextView(this)
        nameTextView.text = recipeName
        nameTextView.textSize = 22f
        nameTextView.setTextColor(Color.BLACK)
        nameTextView.setTypeface(null, Typeface.BOLD)
        nameTextView.setPadding(8, 8, 8, 8)

        // Create TextView to the time
        val prepTimeTextView = TextView(this)
        prepTimeTextView.text = Html.fromHtml("<b>Tempo de preparação:</b> $recipeTime")
        prepTimeTextView.textSize = 16f
        prepTimeTextView.setTextColor(Color.DKGRAY)
        prepTimeTextView.setPadding(8, 8, 8, 8)

        // Create TextView to the difficulty
        val difficultyTextView = TextView(this)
        difficultyTextView.text = Html.fromHtml("<b>Dificuldade:</b><br> $recipeDifficult")
        difficultyTextView.textSize = 16f
        difficultyTextView.setTextColor(Color.DKGRAY)
        difficultyTextView.setPadding(8, 8, 8, 8)

        // Create TextView to the difficulty
        val ingredientsTextView = TextView(this)
        val spannable = SpannableStringBuilder()
        spannable.append("Ingredientes:\n", StyleSpan(Typeface.BOLD), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
        spannable.append(recipeIngredients)
        ingredientsTextView.text = spannable
        ingredientsTextView.textSize = 16f
        ingredientsTextView.setTextColor(Color.DKGRAY)
        ingredientsTextView.setPadding(8, 8, 8, 8)

        // Create TextView to the difficulty
        val stepsTextView = TextView(this)
        val spannable2 = SpannableStringBuilder()
        spannable2.append("Passos:\n", StyleSpan(Typeface.BOLD), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
        spannable2.append(recipeSteps)
        stepsTextView.text = spannable2
        stepsTextView.textSize = 16f
        stepsTextView.setTextColor(Color.DKGRAY)
        stepsTextView.setPadding(8, 8, 8, 8)

        // Add TextViews to LinearLayout
        linearLayout.addView(nameTextView)
        linearLayout.addView(prepTimeTextView)
        linearLayout.addView(difficultyTextView)
        linearLayout.addView(ingredientsTextView)
        linearLayout.addView(stepsTextView)

        // Add LinearLayout to principal layout
        recipeLayout.addView(linearLayout)

        val voltarButton = findViewById<Button>(R.id.btnVoltar)
        voltarButton.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

        val modifyButton: AppCompatButton = findViewById(R.id.editar)
        modifyButton.setOnClickListener {
            val intent = Intent(this, ChangeRecipe::class.java)

            intent.putExtra("RECIPE_NAME", recipeName)
            intent.putExtra("RECIPE_TIME", recipeTime)
            intent.putExtra("RECIPE_DIFFICULT", recipeDifficult)
            intent.putExtra("RECIPE_ID", recipeID)
            intent.putExtra("RECIPE_INGREDIENTS", recipeIngredients)
            intent.putExtra("RECIPE_STEPS", recipeSteps)

            startActivity(intent)
            finish()
        }

    }

    private fun eliminarItem(id: String?) {
        if (id == null) {
            Toast.makeText(this, "ID inválido", Toast.LENGTH_SHORT).show()
            return
        }

        val file = File(filesDir, "receitas.json")
        if (!file.exists()) {
            Toast.makeText(this, "Arquivo não encontrado", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            // Carregar o JSON
            val jsonString = file.readText()
            val jsonArray = JSONArray(jsonString)
            val updatedJsonArray = JSONArray()

            // Filtrar a receita com o ID passado
            var itemRemoved = false
            for (i in 0 until jsonArray.length()) {
                val recipe = jsonArray.getJSONObject(i)
                if (recipe.getString("_id") != id) {
                    updatedJsonArray.put(recipe) // Manter as receitas que não têm o ID igual
                } else {
                    itemRemoved = true // Receita foi removida
                }
            }

            // Se a receita foi removida, salvar o arquivo de volta
            if (itemRemoved) {
                file.writeText(updatedJsonArray.toString())
                Toast.makeText(this, "Receita eliminada com sucesso!", Toast.LENGTH_SHORT).show()

                val intent = Intent(this, MainActivity::class.java)
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                startActivity(intent)
                finish()

            } else {
                Toast.makeText(this, "Receita não encontrada!", Toast.LENGTH_SHORT).show()
            }
        } catch (e: Exception) {
            Log.e("ERROR", "Erro ao eliminar receita", e)
            Toast.makeText(this, "Erro ao eliminar a receita", Toast.LENGTH_SHORT).show()
        }
    }


}