import { upload } from "@vercel/blob/client";
import { useState } from "react"
import { Box, Button, Card, CardBody, CardHeader, Flex, Heading, Icon, Input, List, ListItem, Stack } from "@chakra-ui/react";
import { Clock } from "lucide-react";

interface AnalysisResult {
  indication: string;
  dosage: {
    status: string;
    details: string[];
  };
  conclusion: string;
  runTime: number;
}

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload'
      })
      setImageUrl(newBlob.url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generatePrescription = async () => {
    if (!imageUrl) return

    setIsLoading(true)
    // This is a placeholder. In a real application, you would send the image to your backend for analysis.
    await new Promise(resolve => setTimeout(resolve, 2000))
    setAnalysis({
      indication: "Appropriate",
      dosage: {
        status: "Inappropriate",
        details: [
          "Metformin hydroclorid:",
          "The prescription dosage is 1000 mg, but the documented dosage is 500-850 mg once daily with meals."
        ]
      },
      conclusion: "Inappropriate",
      runTime: 13.01
    })
    setIsLoading(false)
  }

  return (
    <>
      <Card maxW="3xl" mx="auto" p={4}>
        <CardHeader>
          <Heading size="md">Upload Prescription</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={4}>
            <Box border="2px dashed" borderColor="gray.300" borderRadius="lg" p={4}>
              <Input type="file" onChange={handleUpload} accept="image/*" display="none" id="file-upload" />
              <label htmlFor="file-upload">
                <Flex direction="column" align="center" justify="center" cursor="pointer">
                  <Icon as={Clock} w={8} h={8} color="gray.400" />
                  <Box mt={2} fontSize="sm" color="gray.600">Drag and drop file here or click to browse</Box>
                </Flex>
              </label>
            </Box>
            {imageUrl && (
              <Card>
                <CardHeader>
                  <Heading size="sm">Uploaded Image</Heading>
                </CardHeader>
                <CardBody>
                  <Box as="img" src={imageUrl} alt="Uploaded prescription" maxW="full" h="auto" />
                </CardBody>
              </Card>
            )}
            <Button onClick={generatePrescription} isLoading={isLoading} isDisabled={!imageUrl || isLoading} width="full">
              {isLoading ? 'Processing...' : 'Generate Prescription'}
            </Button>
            {analysis && (
              <Card>
                <CardHeader>
                  <Heading size="sm">Analysis Result</Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={4}>
                    <Box fontSize="sm" color="gray.500">
                      Based on the information from Drugs.com, it appears that the current medication regimen may not be fully effective for the conditions listed, which could make the prescription less appropriate:
                    </Box>
                    <Box>
                      <Box fontWeight="semibold">Indication:</Box> <Box color="green.500">{analysis.indication}</Box>
                    </Box>
                    <Box>
                      <Box fontWeight="semibold">Dosage:</Box> <Box color="red.500">{analysis.dosage.status}</Box>
                      <List styleType="disc" pl={4}>
                        {analysis.dosage.details.map((detail, index) => (
                          <ListItem key={index} fontSize="sm">{detail}</ListItem>
                        ))}
                      </List>
                    </Box>
                    <Box>
                      <Box fontWeight="semibold">Conclusion:</Box> <Box color="red.500">{analysis.conclusion}</Box>
                    </Box>
                    <Flex align="center" fontSize="sm" color="gray.500">
                      <Icon as={Clock} w={4} h={4} mr={1} />
                      Run time: {analysis.runTime}s
                    </Flex>
                  </Stack>
                </CardBody>
              </Card>
            )}
          </Stack>
        </CardBody>
      </Card>
    </>
  )
}

export default App
