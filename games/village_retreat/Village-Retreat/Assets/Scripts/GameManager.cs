using UnityEngine;

public class GameManager : MonoBehaviour
{
    public Generator[] generators;
    public Home home;
    public int maxEnergyDepth = 5;
    private bool start = true;

    public void RefreshEnergy()
    {
        foreach (Tile tile in FindObjectsByType<Tile>(FindObjectsSortMode.None))
        {
            tile.WasPoweredLastFrame = tile.IsPowered;
            tile.SetPowered(false, 0);
        }

        foreach (Generator gen in generators)
        {
            gen.Activate(maxEnergyDepth, start);
        }

        home.Check();
    }

    private void Start()
    {
        RefreshEnergy();
        start = false;
    }
}