Add-Type -AssemblyName System.Drawing
$sourcePath = Join-Path $PSScriptRoot '../public/logo-cream.png'
$outputPath = Join-Path $PSScriptRoot '../public/logo-cream-transparent.png'
$sourceBitmap = [System.Drawing.Bitmap]::new([System.IO.Path]::GetFullPath($sourcePath))
$transparentBitmap = [System.Drawing.Bitmap]::new($sourceBitmap.Width, $sourceBitmap.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$left = $sourceBitmap.Width
$top = $sourceBitmap.Height
$right = 0
$bottom = 0
for ($imageY = 0; $imageY -lt $sourceBitmap.Height; $imageY++) {
  for ($imageX = 0; $imageX -lt $sourceBitmap.Width; $imageX++) {
    $pixel = $sourceBitmap.GetPixel($imageX, $imageY)
    if ($pixel.A -gt 0 -and -not ($pixel.R -ge 253 -and $pixel.G -ge 253 -and $pixel.B -ge 253)) {
      $transparentBitmap.SetPixel($imageX, $imageY, $pixel)
      $left = [Math]::Min($left, $imageX)
      $right = [Math]::Max($right, $imageX)
      $top = [Math]::Min($top, $imageY)
      $bottom = [Math]::Max($bottom, $imageY)
    }
  }
}
$sourceBitmap.Dispose()
if ($left -gt $right) { $transparentBitmap.Dispose(); throw 'No logo foreground found.' }
$bounds = [System.Drawing.Rectangle]::new($left, $top, $right - $left + 1, $bottom - $top + 1)
$croppedBitmap = $transparentBitmap.Clone($bounds, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$croppedBitmap.Save([System.IO.Path]::GetFullPath($outputPath), [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Saved transparent footer logo: $($croppedBitmap.Width) x $($croppedBitmap.Height)"
$croppedBitmap.Dispose()
$transparentBitmap.Dispose()
