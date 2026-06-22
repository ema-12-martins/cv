using TMPro;
using UnityEngine;

public class BoneScript : MonoBehaviour
{
    public string boneName;
    public TextMeshProUGUI label;

    private void Start()
    {
        if (label != null)
        {
            label.text = boneName;
        }else
        {
            Debug.LogError("TextMeshPro component not found in children of " + gameObject.name);
        }
    }

}
