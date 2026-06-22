using UnityEngine;

public class PalleteScript : MonoBehaviour
{
    // Vari�veis P�blicas (Configure no Inspector)
    public int selectedColor;
    public Material[] colorMaterials = new Material[8];
    public PaintingThings paintingThings; 

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Brush"))
        {
            MeshRenderer targetRenderer = other.transform.parent.GetComponent<MeshRenderer>();
            Material[] materials = targetRenderer.materials;


            if (selectedColor == 8)
            {
                
                materials[0] = colorMaterials[0];
                PaintingThings.color = 0;
                
            }
            else
            {
                if (PaintingThings.color == 0)
                {
                    if (selectedColor >= 1 && selectedColor <= 3)
                    {
                        materials[0] = colorMaterials[selectedColor];
                        PaintingThings.color = selectedColor;
                    }
                }
                else if (PaintingThings.color == 1)
                {
                    if (selectedColor == 1)
                    {
                        materials[0] = colorMaterials[1];
                        PaintingThings.color = 1;
                    }
                    else if (selectedColor == 2)
                    {
                        materials[0] = colorMaterials[6]; 
                        PaintingThings.color = 6;
                    }
                    else if (selectedColor == 3)
                    {
                        materials[0] = colorMaterials[4]; 
                        PaintingThings.color = 4;
                    }
                }
                else if (PaintingThings.color == 2)
                {
                    if (selectedColor == 1)
                    {
                        materials[0] = colorMaterials[6]; 
                        PaintingThings.color = 6;
                    }
                    else if (selectedColor == 2)
                    {
                        materials[0] = colorMaterials[2]; 
                        PaintingThings.color = 2;
                    }
                    else if (selectedColor == 3)
                    {
                        materials[0] = colorMaterials[5]; 
                        PaintingThings.color = 5;
                    }
                }
                else if (PaintingThings.color == 3)
                {
                    if (selectedColor == 1)
                    {
                        materials[0] = colorMaterials[4]; 
                        PaintingThings.color = 4;
                    }
                    else if (selectedColor == 2)
                    {
                        materials[0] = colorMaterials[5]; 
                        PaintingThings.color = 5;
                    }
                    else if (selectedColor == 3)
                    {
                        materials[0] = colorMaterials[3]; 
                        PaintingThings.color = 3;
                    }
                }else if (PaintingThings.color == 4)
                {
                    if (selectedColor != 1 && selectedColor != 3)
                    {
                        materials[0] = colorMaterials[7]; 
                        PaintingThings.color = 7;
                    }
                    
                }
                else if (PaintingThings.color == 5)
                {
                    if (selectedColor != 2 && selectedColor != 3)
                    {
                        materials[0] = colorMaterials[7]; 
                        PaintingThings.color = 7;
                    }
                    
                }
                else if (PaintingThings.color == 6)
                {
                    if (selectedColor != 1 && selectedColor != 2)
                    {
                        materials[0] = colorMaterials[7]; 
                        PaintingThings.color = 7;
                    }
                    
                }
                else 
                {
                    if (colorMaterials.Length > 7)
                    {
                        materials[0] = colorMaterials[7];
                        PaintingThings.color = 7;
                    }
                }
            }

            targetRenderer.materials = materials;
        }
    }
}