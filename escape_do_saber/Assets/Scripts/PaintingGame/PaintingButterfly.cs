using UnityEngine;

public class PaintingButterfly : MonoBehaviour
{
    public MeshRenderer[] triangles;
    public Material[] materia;
    public PaintingThings paintingThings;
    public int partOfButterfly;

    private void OnTriggerEnter(Collider other)
    {
        if (other.tag == "Brush")
        {
            if (PaintingThings.color > 0)
            {
                Material newMaterial = materia[PaintingThings.color - 1];

                foreach (MeshRenderer renderer in triangles)
                {
                    if (renderer != null)
                    {
                        renderer.material = newMaterial;
                        Debug.Log("Triangle painted with color index: " + (PaintingThings.color - 1));
                    }
                }
                paintingThings.completeColorGame(partOfButterfly);
            }
        }
    }
}