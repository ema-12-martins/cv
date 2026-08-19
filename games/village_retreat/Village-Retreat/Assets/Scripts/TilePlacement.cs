using UnityEngine;

[System.Serializable]
public class TilePlacement
{
    public string tileName;          // Must match name in catalog
    public Vector3 position;         // World position
    public Vector3 rotationEuler;    // Euler angles, will convert to Quaternion
}
