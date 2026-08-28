type AssetsStepProps = {
    selectedAssets: string[]
    onToggleAsset: (assetId: string) => void
  }
  
  function AssetsStep({
    selectedAssets,
    onToggleAsset,
  }: AssetsStepProps) {
    return (
      <div>
        <h2>Assets Step</h2>
  
        <p>{selectedAssets.length} assets selected</p>
  
        <button
          type="button"
          onClick={() => onToggleAsset('bitcoin')}
        >
          Test Bitcoin
        </button>
      </div>
    )
  }
  
  export default AssetsStep