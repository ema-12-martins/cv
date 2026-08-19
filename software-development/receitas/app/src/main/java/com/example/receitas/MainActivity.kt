package com.example.receitas

import android.content.ContentValues
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.receitas.databinding.ActivityMainBinding
import org.json.JSONArray
import org.json.JSONException
import java.io.File
import java.io.IOException

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        //Copy file to fileDir
        copyJsonIfNotExists()

        val button = findViewById<Button>(R.id.adicionar_recipe)
        button.setOnClickListener {
            val intent = Intent(this, AddRecipeActivity::class.java)
            startActivity(intent)
        }

        val recipesLayout = findViewById<LinearLayout>(R.id.recipesLayout)

        val jsonString = readJsonFromFilesDir()

        if (jsonString != null) {
            try {
                val jsonArray = JSONArray(jsonString)

                if (jsonArray.length() > 0) {
                    for (i in 0 until jsonArray.length()) {
                        val recipe = jsonArray.getJSONObject(i)

                        val recipeName = recipe.getString("nome")
                        val prepTime = recipe.getString("tempo_preparacao")
                        val difficultyLevel = recipe.getString("dificuldade")
                        val recipeId = recipe.getString("_id")

                        // Create LinearLayout for each recipe
                        val linearLayout = LinearLayout(this)
                        linearLayout.orientation = LinearLayout.VERTICAL
                        linearLayout.setPadding(16, 16, 16, 16)

                        // Create background
                        val backgroundDrawable = GradientDrawable()
                        backgroundDrawable.setColor(Color.rgb(255, 255, 255)) // Cor de fundo castanho
                        backgroundDrawable.cornerRadius = 25f // Arredondamento das bordas (25px)
                        linearLayout.background = backgroundDrawable
                        backgroundDrawable.setStroke(10, Color.BLACK)

                        //Margin between elements
                        val params = LinearLayout.LayoutParams(
                            LinearLayout.LayoutParams.MATCH_PARENT,
                            LinearLayout.LayoutParams.WRAP_CONTENT
                        )
                        params.setMargins(20, 20, 20, 20) // Define margens (esquerda, topo, direita, baixo)
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
                        prepTimeTextView.text = "Tempo de preparação: $prepTime"
                        prepTimeTextView.textSize = 16f
                        prepTimeTextView.setTextColor(Color.DKGRAY)
                        prepTimeTextView.setPadding(8, 8, 8, 8)

                        // Create TextView to the difficulty
                        val difficultyTextView = TextView(this)
                        difficultyTextView.text = "Dificuldade: $difficultyLevel"
                        difficultyTextView.textSize = 16f
                        difficultyTextView.setTextColor(Color.DKGRAY)
                        difficultyTextView.setPadding(8, 8, 8, 8)

                        // Add TextViews to LinearLayout
                        linearLayout.addView(nameTextView)
                        linearLayout.addView(prepTimeTextView)
                        linearLayout.addView(difficultyTextView)

                        // Add LinearLayout to principal layout
                        recipesLayout.addView(linearLayout)

                        //Redirect when clicked
                        linearLayout.setOnClickListener {
                            val intent = Intent(this, RecipeDetailActivity::class.java)

                            intent.putExtra("RECIPE_NAME", recipeName)
                            intent.putExtra("RECIPE_TIME", prepTime)
                            intent.putExtra("RECIPE_DIFFICULT", difficultyLevel)

                            val recipeIngredients = recipe.getJSONArray("ingredientes")
                            val recipeSteps = recipe.getJSONArray("passos")

                            intent.putExtra("RECIPE_ID", recipeId)

                            val formattedIngredients = (0 until recipeIngredients.length()).joinToString("\n") { index ->
                                "- ${recipeIngredients.getString(index)}"
                            }

                            val formattedSteps = (0 until recipeSteps.length()).joinToString("\n") { index ->
                                "${index + 1}. ${recipeSteps.getString(index)}"
                            }
                            intent.putExtra("RECIPE_INGREDIENTS", formattedIngredients)
                            intent.putExtra("RECIPE_STEPS", formattedSteps)

                            startActivity(intent)
                        }

                    }
                } else {
                    Log.w("WARNING", "Nenhuma receita encontrada no JSON")
                    showErrorMessage(recipesLayout, "Nenhuma receita encontrada.")
                }
            } catch (e: JSONException) {
                Log.e("ERROR", "Erro ao processar JSON", e)
                showErrorMessage(recipesLayout, "Erro ao processar as receitas.")
            }
        } else {
            showErrorMessage(recipesLayout, "Erro ao carregar receitas.")
        }

        val downloadButton: Button = findViewById(R.id.download)
        downloadButton.setOnClickListener {
            val sourceFile = File(filesDir, "receitas.json")

            if (!sourceFile.exists()) {
                Toast.makeText(this, "Arquivo não encontrado", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val content = sourceFile.readBytes()

            val resolver = contentResolver
            val contentValues = ContentValues().apply {
                put(MediaStore.Downloads.DISPLAY_NAME, "receitas.json")
                put(MediaStore.Downloads.MIME_TYPE, "application/json")
                put(MediaStore.Downloads.IS_PENDING, 1)
            }

            val collection = MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
            val uri = resolver.insert(collection, contentValues)

            uri?.let {
                resolver.openOutputStream(it)?.use { outputStream ->
                    outputStream.write(content)
                }

                contentValues.clear()
                contentValues.put(MediaStore.Downloads.IS_PENDING, 0)
                resolver.update(uri, contentValues, null, null)

                Toast.makeText(this, "Arquivo salvo.", Toast.LENGTH_SHORT).show()
            } ?: run {
                Toast.makeText(this, "Erro ao salvar o arquivo", Toast.LENGTH_SHORT).show()
            }
        }

    }

    private fun readJsonFromFilesDir(): String? {
        val file = File(filesDir, "receitas.json")
        return if (file.exists()) {
            try {
                file.readText()
            } catch (e: IOException) {
                null
            }
        } else {
            null
        }
    }

    private fun showErrorMessage(layout: LinearLayout, message: String) {
        val textView = TextView(this)
        textView.text = message
        textView.textSize = 18f
        textView.setTextColor(Color.RED)
        textView.setPadding(8, 8, 8, 8)
        layout.addView(textView)
    }

    private fun copyJsonIfNotExists() {
        val file = File(filesDir, "receitas.json")
        if (!file.exists()) {
            try {
                assets.open("receitas.json").use { inputStream ->
                    file.outputStream().use { outputStream ->
                        inputStream.copyTo(outputStream)
                    }
                }
                Log.d("INFO", "Ficheiro receitas.json copiado para filesDir")
            } catch (e: IOException) {
                Log.e("ERROR", "Erro ao copiar o JSON dos assets", e)
            }
        }
    }

}
