using UnityEngine;

[ExecuteInEditMode]
public class MapScaler : MonoBehaviour
{
    public Vector2 targetSize = new(17, 13); // X = width, Y = height in world units

    void Start()
    {
        Renderer[] renderers = GetComponentsInChildren<Renderer>();

        if (renderers.Length == 0)
        {
            Debug.LogWarning("No renderers found in children.");
            return;
        }

        Bounds combinedBounds = renderers[0].bounds;
        foreach (Renderer r in renderers)
        {
            combinedBounds.Encapsulate(r.bounds);
        }

        Vector3 size = combinedBounds.size;
        Debug.Log($"Original Map Size (World Space): {size}");

        Vector3 scale = transform.localScale;

        // Since the map is rotated -90° on X, Z becomes Y in visual terms
        float visualWidth = size.x;   // Horizontal width (X axis)
        float visualHeight = size.y;  // Vertical height (Z visual, but it's Y in world due to rotation)

        scale.x *= targetSize.x / visualWidth;
        scale.y *= targetSize.y / visualHeight; // scale in Y because Z is visually Y

        transform.localScale = scale;

        Debug.Log($"Scaled to fit exactly {targetSize}");
    }
}
